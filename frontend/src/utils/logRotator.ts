import fs from 'fs';
import path from 'path';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_BACKUP_FILES = 5;
const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

export class LogRotator {
  private static instance: LogRotator;
  private currentSize: number = 0;

  private constructor() {
    this.ensureLogDirectory();
    this.initializeLogFile();
    this.updateCurrentSize();
  }

  public static getInstance(): LogRotator {
    if (!LogRotator.instance) {
      LogRotator.instance = new LogRotator();
    }
    return LogRotator.instance;
  }

  private ensureLogDirectory() {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
  }

  private initializeLogFile() {
    if (!fs.existsSync(LOG_FILE)) {
      fs.writeFileSync(LOG_FILE, '');
    }
  }

  private updateCurrentSize() {
    try {
      const stats = fs.statSync(LOG_FILE);
      this.currentSize = stats.size;
    } catch (error) {
      this.currentSize = 0;
    }
  }

  private rotateLogs() {
    // Remove oldest backup if it exists
    const oldestBackup = path.join(LOG_DIR, `app.${MAX_BACKUP_FILES}.log`);
    if (fs.existsSync(oldestBackup)) {
      fs.unlinkSync(oldestBackup);
    }

    // Shift existing backups
    for (let i = MAX_BACKUP_FILES - 1; i >= 1; i--) {
      const oldPath = path.join(LOG_DIR, `app.${i}.log`);
      const newPath = path.join(LOG_DIR, `app.${i + 1}.log`);
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
      }
    }

    // Rename current log file to backup
    if (fs.existsSync(LOG_FILE)) {
      fs.renameSync(LOG_FILE, path.join(LOG_DIR, 'app.1.log'));
    }

    // Create new log file
    fs.writeFileSync(LOG_FILE, '');
    this.currentSize = 0;
  }

  public async writeLog(logEntry: any): Promise<void> {
    const logString = JSON.stringify(logEntry) + '\n';
    const logSize = Buffer.byteLength(logString, 'utf8');

    // Check if we need to rotate
    if (this.currentSize + logSize > MAX_FILE_SIZE) {
      this.rotateLogs();
    }

    // Write the log entry
    try {
      fs.appendFileSync(LOG_FILE, logString);
      this.currentSize += logSize;
    } catch (error) {
      console.error('Error writing to log file:', error);
      // Try to recover by reinitializing the file
      this.initializeLogFile();
      this.updateCurrentSize();
      // Retry writing
      fs.appendFileSync(LOG_FILE, logString);
      this.currentSize += logSize;
    }
  }

  public getLogFiles(): string[] {
    const files: string[] = [];
    for (let i = 1; i <= MAX_BACKUP_FILES; i++) {
      const filePath = path.join(LOG_DIR, `app.${i}.log`);
      if (fs.existsSync(filePath)) {
        files.push(filePath);
      }
    }
    if (fs.existsSync(LOG_FILE)) {
      files.unshift(LOG_FILE);
    }
    return files;
  }

  public async readLogs(filePath: string = LOG_FILE): Promise<any[]> {
    try {
      if (!fs.existsSync(filePath)) {
        return [];
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      return content
        .split('\n')
        .filter(Boolean)
        .map(line => {
          try {
            return JSON.parse(line);
          } catch (e) {
            console.error('Error parsing log line:', line);
            return null;
          }
        })
        .filter(Boolean);
    } catch (error) {
      console.error('Error reading log file:', error);
      return [];
    }
  }

  public async getLogStats(filePath: string = LOG_FILE): Promise<any> {
    const logs = await this.readLogs(filePath);
    
    if (logs.length === 0) {
      return {
        total: 0,
        byLevel: { error: 0, warn: 0, info: 0, debug: 0 },
        timeRange: { start: null, end: null },
        errorsByLocation: {},
        hourlyDistribution: {},
        averageErrorsPerHour: 0,
        mostCommonErrors: []
      };
    }

    const stats = {
      total: logs.length,
      byLevel: {
        error: logs.filter(log => log.level === 'error').length,
        warn: logs.filter(log => log.level === 'warn').length,
        info: logs.filter(log => log.level === 'info').length,
        debug: logs.filter(log => log.level === 'debug').length
      },
      timeRange: {
        start: logs[logs.length - 1].timestamp,
        end: logs[0].timestamp
      },
      errorsByLocation: logs
        .filter(log => log.level === 'error')
        .reduce((acc: { [key: string]: number }, log) => {
          const location = log.location || 'unknown';
          acc[location] = (acc[location] || 0) + 1;
          return acc;
        }, {}),
      hourlyDistribution: logs.reduce((acc: { [key: string]: number }, log) => {
        const hour = new Date(log.timestamp).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {}),
      averageErrorsPerHour: 0,
      mostCommonErrors: [] as { message: string; count: number }[]
    };

    // Calculate average errors per hour
    const errorLogs = logs.filter(log => log.level === 'error');
    if (errorLogs.length > 0) {
      const timeSpan = new Date(stats.timeRange.end).getTime() - new Date(stats.timeRange.start).getTime();
      const hoursSpan = Math.max(timeSpan / (1000 * 60 * 60), 1); // Ensure at least 1 hour
      stats.averageErrorsPerHour = errorLogs.length / hoursSpan;
    }

    // Find most common errors
    const errorCounts = errorLogs.reduce((acc: { [key: string]: number }, log) => {
      acc[log.message] = (acc[log.message] || 0) + 1;
      return acc;
    }, {});

    stats.mostCommonErrors = Object.entries(errorCounts)
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return stats;
  }
} 