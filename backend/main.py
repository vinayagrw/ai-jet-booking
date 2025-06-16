import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Request, Path
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from backend.routers import auth, jets, bookings, memberships, ownership_shares, admin, contact, categories, logs, users, chat
from backend.database import engine, Base, get_db
from backend.logger import api_logger
from sqlalchemy.orm import Session
from . import models, schemas, crud
import time
from uuid import UUID
from typing import List
import logging

# Load environment variables from .env file
load_dotenv()

# Get the secret key and debug mode from environment variables
SECRET_KEY = os.getenv("SECRET_KEY")
DEBUG = os.getenv("DEBUG") == "True"  # Convert to boolean

# Create database tables
Base.metadata.create_all(bind=engine)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Jet Booking API",
    description="API for private jet booking platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Default React port
        "http://localhost:5173",  # Vite default port
        "http://127.0.0.1:5173",  # Vite default alternative
        "http://localhost:3010"   # MCP server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Middleware for request logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    api_logger.info(
        f"Method: {request.method} Path: {request.url.path} "
        f"Status: {response.status_code} Duration: {process_time:.2f}s"
    )
    
    return response

# Error handling middleware
@app.middleware("http")
async def error_handling(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        api_logger.error(f"Unhandled error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Include routers
app.include_router(auth.router, prefix="/api/v1", tags=["Auth"])
app.include_router(users.router, prefix="/api/v1", tags=["Users"])
app.include_router(chat.router, prefix="/api/v1", tags=["Chat"])
app.include_router(jets.router, prefix="/api/v1", tags=["Jets"])
app.include_router(bookings.router, prefix="/api/v1", tags=["Bookings"])
app.include_router(memberships.router, prefix="/api/v1", tags=["Memberships"])
app.include_router(ownership_shares.router, prefix="/api/v1", tags=["Ownership Shares"])
app.include_router(admin.router, prefix="/api/v1", tags=["Admin"])
app.include_router(contact.router, prefix="/api/v1", tags=["Contact"])
app.include_router(categories.router, prefix="/api/v1", tags=["Categories"])
app.include_router(logs.router, prefix="/api/v1", tags=["Logs"])
app.include_router(users.router, prefix="/api/v1")

@app.get("/")
async def root():
    api_logger.info("Root endpoint accessed")
    return {"message": "Welcome to AI Jet Booking API"}

if __name__ == "__main__":
    api_logger.info("Starting Uvicorn server.")
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        factory=True
    ) 