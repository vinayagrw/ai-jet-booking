from sqlalchemy import create_engine, Column, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost/ai_jet_booking")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Add updated_at column to memberships table if it doesn't exist
def init_db():
    Base.metadata.create_all(bind=engine)
    
    # Add updated_at column if it doesn't exist
    with engine.connect() as conn:
        conn.execute("""
            DO $$ 
            BEGIN 
                IF NOT EXISTS (
                    SELECT 1 
                    FROM information_schema.columns 
                    WHERE table_name = 'memberships' 
                    AND column_name = 'updated_at'
                ) THEN 
                    ALTER TABLE memberships 
                    ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
                END IF;
            END $$;
        """)
        conn.commit()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 