from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import logging # Import the logging module

from .. import schemas, models
from ..database import get_db
from .auth import get_current_active_user

# Configure logger for this module
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"],
    responses={
        401: {"description": "Unauthorized - User not logged in or token invalid"},
        403: {"description": "Forbidden - Not authorized to perform action"},
        404: {"description": "Booking or associated resource not found"},
    },
)

@router.post("/", response_model=schemas.Booking, summary="Create a new booking")
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    # Logic to create a booking
    return booking

@router.get("/", response_model=List[schemas.Booking], summary="Get all bookings for the current user")
def get_bookings(db: Session = Depends(get_db)):
    # Logic to fetch all bookings
    return db.query(models.Booking).all()

@router.get("/{booking_id}", response_model=schemas.Booking, summary="Get details of a specific booking")
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    # Logic to fetch a specific booking
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Cancel a booking")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    # Logic to cancel a booking
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(booking)
    db.commit()
    return {"message": "Booking cancelled successfully"} 