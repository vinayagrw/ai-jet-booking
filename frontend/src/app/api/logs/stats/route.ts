import { NextResponse } from 'next/server';
import { LogRotator } from '@/utils/logRotator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file') || 'app.log';
    
    const logRotator = LogRotator.getInstance();
    const stats = await logRotator.getLogStats(file);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error calculating log statistics:', error);
    return NextResponse.json(
      { error: 'Failed to calculate log statistics' },
      { status: 500 }
    );
  }
} 