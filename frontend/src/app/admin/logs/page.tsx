'use client';

import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  location?: string;
  stack?: string;
}

interface LogFile {
  name: string;
  path: string;
}

interface LogStats {
  total: number;
  byLevel: {
    error: number;
    warn: number;
    info: number;
    debug: number;
  };
  timeRange: {
    start: string | null;
    end: string | null;
  };
  errorsByLocation: { [key: string]: number };
  hourlyDistribution: { [key: string]: number };
  averageErrorsPerHour: number;
  mostCommonErrors: { message: string; count: number }[];
}

export default function LogsDashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logFiles, setLogFiles] = useState<LogFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('app.log');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [filters, setFilters] = useState({
    level: '',
    search: '',
    startTime: '',
    endTime: '',
  });

  const fetchLogFiles = async () => {
    try {
      const response = await fetch('/api/logs/files');
      if (!response.ok) throw new Error('Failed to fetch log files');
      const files = await response.json();
      setLogFiles(files);
    } catch (err) {
      logger.error('Error fetching log files:', err);
    }
  };

  const addTestLogs = async () => {
    const testLogs = [
      {
        level: 'info',
        message: 'Application started',
        timestamp: new Date().toISOString(),
        location: '/admin/logs'
      },
      {
        level: 'warn',
        message: 'High memory usage detected',
        timestamp: new Date().toISOString(),
        location: '/admin/dashboard'
      },
      {
        level: 'error',
        message: 'Failed to connect to database',
        timestamp: new Date().toISOString(),
        location: '/api/database'
      },
      {
        level: 'debug',
        message: 'Processing request',
        timestamp: new Date().toISOString(),
        location: '/api/logs'
      }
    ];

    for (const log of testLogs) {
      await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      });
    }
  };

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.level) params.append('level', filters.level);
      if (filters.search) params.append('search', filters.search);
      if (filters.startTime) params.append('start_time', filters.startTime);
      if (filters.endTime) params.append('end_time', filters.endTime);
      params.append('file', selectedFile);

      const response = await fetch(`/api/logs?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setLogs(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch logs';
      setError(errorMessage);
      logger.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/logs/stats?file=${selectedFile}`);
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      logger.error('Error fetching statistics:', err);
    }
  };

  const downloadLogs = async () => {
    try {
      const response = await fetch(`/api/logs/download?file=${selectedFile}`);
      if (!response.ok) throw new Error('Failed to download logs');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedFile}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      logger.error('Error downloading logs:', err);
      setError('Failed to download logs');
    }
  };

  useEffect(() => {
    fetchLogFiles();
    // Add test logs if no logs exist
    if (logs.length === 0) {
      addTestLogs();
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    fetchStats();
    // Refresh logs every 30 seconds
    const interval = setInterval(() => {
      fetchLogs();
      fetchStats();
    }, 30000);
    return () => clearInterval(interval);
  }, [filters, selectedFile]);

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warn': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'debug': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loading logs...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Logs Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Monitor application logs in real-time
            </p>
          </div>
          <button
            onClick={downloadLogs}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Download Logs
          </button>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Log Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Log Levels</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Logs:</span>
                    <span className="font-medium">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Errors:</span>
                    <span className="font-medium">{stats.byLevel.error}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Warnings:</span>
                    <span className="font-medium">{stats.byLevel.warn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Info:</span>
                    <span className="font-medium">{stats.byLevel.info}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-600">Debug:</span>
                    <span className="font-medium">{stats.byLevel.debug}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Time Range</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Start:</span>
                    <span className="font-medium">
                      {stats.timeRange.start ? new Date(stats.timeRange.start).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">End:</span>
                    <span className="font-medium">
                      {stats.timeRange.end ? new Date(stats.timeRange.end).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Avg Errors/Hour:</span>
                    <span className="font-medium">{stats.averageErrorsPerHour.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Top Errors</h3>
                <div className="space-y-2">
                  {stats.mostCommonErrors.map((error, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                        {error.message}
                      </span>
                      <span className="font-medium">{error.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Log File Selection */}
        <div className="mb-6">
          <label htmlFor="logFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Log File
          </label>
          <select
            id="logFile"
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {logFiles.map((file) => (
              <option key={file.path} value={file.path}>
                {file.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.level}
              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
              className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Levels</option>
              <option value="error">Error</option>
              <option value="warn">Warning</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>

            <input
              type="text"
              placeholder="Search logs..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />

            <input
              type="datetime-local"
              value={filters.startTime}
              onChange={(e) => setFilters(prev => ({ ...prev, startTime: e.target.value }))}
              className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />

            <input
              type="datetime-local"
              value={filters.endTime}
              onChange={(e) => setFilters(prev => ({ ...prev, endTime: e.target.value }))}
              className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {log.message}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {log.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 