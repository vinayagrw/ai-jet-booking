import { NextResponse } from 'next/server';
import { LogRotator } from '@/utils/logRotator';

export async function GET() {
  try {
    const logRotator = LogRotator.getInstance();
    const files = logRotator.getLogFiles();
    
    const fileList = files.map(filePath => ({
      name: filePath.split('/').pop() || filePath,
      path: filePath
    }));
    
    return NextResponse.json(fileList);
  } catch (error) {
    console.error('Error listing log files:', error);
    return NextResponse.json(
      { error: 'Failed to list log files' },
      { status: 500 }
    );
  }
} 