// Logger that works in both client and server environments
const log = {
  info: (...args: any[]) => {
    const timestamp = new Date().toISOString();
    const message = args.join(' ');
    
    if (typeof window === 'undefined') {
      // Server-side logging (terminal)
      process.stdout.write(`\x1b[36m[${timestamp}] [INFO]\x1b[0m ${message}\n`);
    } else {
      // Client-side logging (browser console)
      console.log('\x1b[36m%s\x1b[0m', `[${timestamp}] [INFO]`, ...args);
      // Send to server
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          level: 'info', 
          message,
          timestamp,
          location: window.location.href
        })
      }).catch(() => {}); // Ignore errors
    }
  },
  error: (...args: any[]) => {
    const timestamp = new Date().toISOString();
    const message = args.join(' ');
    
    if (typeof window === 'undefined') {
      process.stdout.write(`\x1b[31m[${timestamp}] [ERROR]\x1b[0m ${message}\n`);
    } else {
      console.error('\x1b[31m%s\x1b[0m', `[${timestamp}] [ERROR]`, ...args);
      // Send to server
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          level: 'error', 
          message,
          timestamp,
          location: window.location.href,
          stack: new Error().stack
        })
      }).catch(() => {}); // Ignore errors
    }
  },
  warn: (...args: any[]) => {
    const timestamp = new Date().toISOString();
    const message = args.join(' ');
    
    if (typeof window === 'undefined') {
      process.stdout.write(`\x1b[33m[${timestamp}] [WARN]\x1b[0m ${message}\n`);
    } else {
      console.warn('\x1b[33m%s\x1b[0m', `[${timestamp}] [WARN]`, ...args);
      // Send to server
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          level: 'warn', 
          message,
          timestamp,
          location: window.location.href
        })
      }).catch(() => {}); // Ignore errors
    }
  },
  debug: (...args: any[]) => {
    const timestamp = new Date().toISOString();
    const message = args.join(' ');
    
    if (typeof window === 'undefined') {
      process.stdout.write(`\x1b[35m[${timestamp}] [DEBUG]\x1b[0m ${message}\n`);
    } else {
      console.debug('\x1b[35m%s\x1b[0m', `[${timestamp}] [DEBUG]`, ...args);
      // Send to server
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          level: 'debug', 
          message,
          timestamp,
          location: window.location.href
        })
      }).catch(() => {}); // Ignore errors
    }
  }
};

// Only log initialization in development
if (process.env.NODE_ENV === 'development') {
  if (typeof window === 'undefined') {
    log.info('Logger initialized on server');
  } else {
    log.info('Logger initialized on client');
  }
}

export const logger = log; 