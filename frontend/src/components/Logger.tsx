'use client';

import { useEffect } from 'react';

export function Logger() {
  useEffect(() => {
    // Override console methods to add timestamps and styling
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
    };

    const formatMessage = (type: string, ...args: any[]) => {
      const timestamp = new Date().toISOString();
      const styles = {
        log: 'color: #4CAF50',
        error: 'color: #F44336',
        warn: 'color: #FFC107',
        info: 'color: #2196F3',
      };

      return [`%c[${timestamp}] [${type.toUpperCase()}]`, styles[type as keyof typeof styles], ...args];
    };

    console.log = (...args) => originalConsole.log(...formatMessage('log', ...args));
    console.error = (...args) => originalConsole.error(...formatMessage('error', ...args));
    console.warn = (...args) => originalConsole.warn(...formatMessage('warn', ...args));
    console.info = (...args) => originalConsole.info(...formatMessage('info', ...args));

    // Log initial page load
    console.info('Application initialized');

    // Cleanup function
    return () => {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
    };
  }, []);

  return null;
} 