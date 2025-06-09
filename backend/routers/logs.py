from fastapi import APIRouter, Query
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
import json
import os

router = APIRouter()

class LogEntry(BaseModel):
    level: str
    message: str
    timestamp: str
    location: Optional[str] = None
    stack: Optional[str] = None

@router.get("/logs", response_model=List[LogEntry])
async def get_logs(
    level: Optional[str] = Query(None, description="Filter by log level (info, warn, error, debug)"),
    start_time: Optional[datetime] = Query(None, description="Filter logs after this time"),
    end_time: Optional[datetime] = Query(None, description="Filter logs before this time"),
    search: Optional[str] = Query(None, description="Search in log messages"),
    limit: int = Query(100, description="Number of logs to return")
):
    logs = []
    log_file = "app.log"
    
    if not os.path.exists(log_file):
        return []
        
    with open(log_file, "r") as f:
        for line in f:
            try:
                log_entry = json.loads(line)
                entry = LogEntry(**log_entry)
                
                # Apply filters
                if level and entry.level != level:
                    continue
                    
                if start_time and datetime.fromisoformat(entry.timestamp) < start_time:
                    continue
                    
                if end_time and datetime.fromisoformat(entry.timestamp) > end_time:
                    continue
                    
                if search and search.lower() not in entry.message.lower():
                    continue
                    
                logs.append(entry)
                
                if len(logs) >= limit:
                    break
                    
            except json.JSONDecodeError:
                continue
                
    return logs[::-1]  # Return in reverse chronological order 