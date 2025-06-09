import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const logEntry = await request.json();
    
    // Ensure the log entry has all required fields
    if (!logEntry.level || !logEntry.message || !logEntry.timestamp) {
      return NextResponse.json(
        { error: 'Invalid log entry' },
        { status: 400 }
      );
    }
    
    // Write log to file
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }
    
    const logFile = path.join(logDir, 'app.log');
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing log:', error);
    return NextResponse.json(
      { error: 'Failed to write log' },
      { status: 500 }
    );
  }
} 