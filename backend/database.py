from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from .logger import db_logger

# Load environment variables from .env file
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

# Get database URL from environment variable or use default
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    db_logger.warning("DATABASE_URL not found in environment variables, using default")
    DATABASE_URL = "postgresql://postgres:admin@localhost:5432/ai_jet_booking"

db_logger.info(f"Using database URL: {DATABASE_URL}")

try:
    # Create SQLAlchemy engine
    engine = create_engine(DATABASE_URL, echo=True)
    db_logger.info("Database engine created successfully")
except Exception as e:
    db_logger.error(f"Failed to create database engine: {str(e)}")
    raise

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        db_logger.info("Database session opened")
        yield db
    except Exception as e:
        db_logger.error(f"Database error: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()
        db_logger.info("Database session closed") 