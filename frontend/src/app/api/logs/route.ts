import { NextResponse } from 'next/server';
import { LogRotator } from '@/utils/logRotator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const search = searchParams.get('search');
    const startTime = searchParams.get('start_time');
    const endTime = searchParams.get('end_time');
    const file = searchParams.get('file') || 'app.log';
    
    const logRotator = LogRotator.getInstance();
    let logs = await logRotator.readLogs();
    
    // Apply filters
    if (level) {
      logs = logs.filter(log => log.level === level);
    }
    
    if (search) {
      logs = logs.filter(log => 
        log.message.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (startTime) {
      logs = logs.filter(log => 
        new Date(log.timestamp) >= new Date(startTime)
      );
    }
    
    if (endTime) {
      logs = logs.filter(log => 
        new Date(log.timestamp) <= new Date(endTime)
      );
    }
    
    // Return most recent logs first
    return NextResponse.json(logs.reverse());
  } catch (error) {
    console.error('Error reading logs:', error);
    return NextResponse.json(
      { error: 'Failed to read logs' },
      { status: 500 }
    );
  }
}

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
    
    // Write log using log rotator
    const logRotator = LogRotator.getInstance();
    await logRotator.writeLog(logEntry);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing log:', error);
    return NextResponse.json(
      { error: 'Failed to write log' },
      { status: 500 }
    );
  }
} 