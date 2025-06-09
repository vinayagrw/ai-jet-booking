import { NextResponse } from 'next/server';
import { LogRotator } from '@/utils/logRotator';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file') || 'app.log';
    
    const logRotator = LogRotator.getInstance();
    const logContent = await logRotator.readLogs(file);
    
    // Convert logs to CSV format
    const headers = ['Timestamp', 'Level', 'Message', 'Location', 'Stack'];
    const csvRows = [
      headers.join(','),
      ...logContent.map(log => [
        log.timestamp,
        log.level,
        `"${log.message.replace(/"/g, '""')}"`,
        log.location || '',
        log.stack ? `"${log.stack.replace(/"/g, '""')}"` : ''
      ].join(','))
    ].join('\n');
    
    // Create response with CSV file
    const response = new NextResponse(csvRows);
    response.headers.set('Content-Type', 'text/csv');
    response.headers.set('Content-Disposition', `attachment; filename="${path.basename(file)}.csv"`);
    
    return response;
  } catch (error) {
    console.error('Error downloading logs:', error);
    return NextResponse.json(
      { error: 'Failed to download logs' },
      { status: 500 }
    );
  }
} 