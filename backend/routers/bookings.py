from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import logging
import json
from datetime import datetime

from .. import schemas, models
from ..database import get_db
from .auth import get_current_user

# Configure logger for this module
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"],
)

@router.post("/", response_model=schemas.Booking, summary="Create a new booking")
def create_booking(
    booking: schemas.BookingCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new booking in the database."""
    logger.info(f"Creating new booking for jet ID: {booking.jet_id}")
    try:
        # Create a new booking record
        db_booking = models.Booking(
            user_id=current_user.id,
            jet_id=booking.jet_id,
            origin=booking.origin,
            destination=booking.destination,
            start_time=booking.start_time,
            end_time=booking.end_time,
            passengers=booking.passengers,
            special_requests=booking.special_requests,
            status="pending"
        )
        
        # Add to database and commit
        db.add(db_booking)
        db.commit()
        db.refresh(db_booking)
        
        logger.info(f"Successfully created booking with ID: {db_booking.id}")
        return db_booking
    except Exception as e:
        logger.error(f"Error creating booking: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create booking"
        )

@router.get("/", response_model=List[schemas.Booking], summary="Get all bookings for the current user")
def get_bookings(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all bookings for the current user."""
    try:
        bookings = db.query(models.Booking).filter(models.Booking.user_id == current_user.id).all()
        return bookings
    except Exception as e:
        logger.error(f"Error fetching bookings: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch bookings"
        )

@router.get("/{booking_id}", response_model=schemas.Booking, summary="Get details of a specific booking")
def get_booking(
    booking_id: UUID,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get details of a specific booking."""
    try:
        booking = db.query(models.Booking).filter(
            models.Booking.id == booking_id,
            models.Booking.user_id == current_user.id
        ).first()
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        return booking
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching booking: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch booking"
        )

@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Cancel a booking")
def cancel_booking(
    booking_id: UUID,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel a booking."""
    try:
        booking = db.query(models.Booking).filter(
            models.Booking.id == booking_id,
            models.Booking.user_id == current_user.id
        ).first()
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        db.delete(booking)
        db.commit()
        return {"message": "Booking cancelled successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error cancelling booking: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to cancel booking"
        )

@router.get("/my-bookings", response_model=List[schemas.Booking])
async def get_my_bookings(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the current user's bookings."""
    try:
        logger.info(f"Fetching bookings for user: {current_user.email}")
        bookings = db.query(models.Booking).filter(
            models.Booking.user_id == current_user.id
        ).all()
        
        # Log the number of bookings found
        logger.info(f"Found {len(bookings)} bookings for user {current_user.email}")
        
        # Log detailed information about each booking
        for booking in bookings:
            booking_dict = {
                'id': str(booking.id),
                'user_id': str(booking.user_id),
                'jet_id': str(booking.jet_id),
                'origin': booking.origin,
                'destination': booking.destination,
                'start_time': booking.start_time.isoformat() if booking.start_time else None,
                'end_time': booking.end_time.isoformat() if booking.end_time else None,
                'status': booking.status,
                'passengers': booking.passengers,
                'special_requests': booking.special_requests,
                'total_price': float(booking.total_price) if booking.total_price else None,
                'created_at': booking.created_at.isoformat() if booking.created_at else None,
                'updated_at': booking.updated_at.isoformat() if booking.updated_at else None
            }
            logger.info(f"Booking data: {json.dumps(booking_dict, indent=2)}")
        
        # Try to convert the first booking to a dict to check for any serialization issues
        if bookings:
            try:
                first_booking_dict = bookings[0].__dict__
                logger.info(f"First booking dict: {json.dumps({k: str(v) for k, v in first_booking_dict.items()}, indent=2)}")
            except Exception as e:
                logger.error(f"Error converting first booking to dict: {str(e)}")
        
        return bookings
    except Exception as e:
        logger.error(f"Error fetching user bookings: {str(e)}")
        logger.exception("Full traceback:")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching bookings"
        ) 