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
def create_booking(
    booking: schemas.BookingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Create a new booking for a private jet.\n\n    Requires authentication. The booking must be made by the currently authenticated user.\n\n    Args:\n        booking (schemas.BookingCreate): Details of the booking to create.\n        db (Session): Database session dependency.\n        current_user (models.User): The currently authenticated user.\n\n    Raises:\n        HTTPException: 403 if the user tries to create a booking for another user.\n        HTTPException: 404 if the specified jet or user is not found (though user is from token, jet still needs check).\n\n    Returns:\n        schemas.Booking: The newly created booking object.\n    """
    logger.info(f"Attempting to create booking for user ID: {current_user.id}")
    if current_user.id != booking.userId:
        logger.warning(f"User {current_user.id} attempted to create booking for another user {booking.userId}.")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot create bookings for other users")

    db_booking = models.Booking(**booking.dict())
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    logger.info(f"Booking created successfully with ID: {db_booking.id} by user ID: {current_user.id}")
    return db_booking

@router.get("/", response_model=List[schemas.Booking], summary="Get all bookings for the current user")
def get_user_bookings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Retrieve a list of all bookings made by the currently authenticated user.\n\n    Requires authentication.\n\n    Args:\n        db (Session): Database session dependency.\n        current_user (models.User): The currently authenticated user.\n\n    Returns:\n        List[schemas.Booking]: A list of booking objects for the current user.\n    """
    logger.info(f"Fetching all bookings for user ID: {current_user.id}")
    bookings = db.query(models.Booking).filter(models.Booking.userId == current_user.id).all()
    logger.info(f"Retrieved {len(bookings)} bookings for user ID: {current_user.id}")
    return bookings

@router.get("/{booking_id}", response_model=schemas.Booking, summary="Get details of a specific booking")
def get_booking_details(
    booking_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Retrieve details of a specific booking by its ID.\n\n    Requires authentication. Only the owner of the booking or an admin can view details.\n\n    Args:\n        booking_id (UUID): The unique identifier of the booking.\n        db (Session): Database session dependency.\n        current_user (models.User): The currently authenticated user.\n\n    Raises:\n        HTTPException: 404 if the booking is not found or not authorized for the current user.\n\n    Returns:\n        schemas.Booking: The booking object.\n    """
    logger.info(f"Attempting to retrieve booking {booking_id} for user ID: {current_user.id}")
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id, models.Booking.userId == current_user.id).first()
    if not booking:
        logger.warning(f"Booking {booking_id} not found or not authorized for user ID: {current_user.id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found or not authorized")
    logger.info(f"Successfully retrieved booking {booking_id} for user ID: {current_user.id}")
    return booking

@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Cancel a booking")
def cancel_booking(
    booking_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Cancel a specific booking by its ID.\n\n    Requires authentication. Only the owner of the booking or an admin can cancel it.\n\n    Args:\n        booking_id (UUID): The unique identifier of the booking.\n        db (Session): Database session dependency.\n        current_user (models.User): The currently authenticated user.\n\n    Raises:\n        HTTPException: 404 if the booking is not found or not authorized for the current user.\n\n    Returns:\n        dict: A confirmation message upon successful cancellation.\n    """
    logger.info(f"Attempting to cancel booking {booking_id} by user ID: {current_user.id}")
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id, models.Booking.userId == current_user.id).first()
    if not booking:
        logger.warning(f"Booking {booking_id} not found or not authorized for cancellation by user ID: {current_user.id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found or not authorized")
    
    # In a real application, you might update the status to 'cancelled' instead of deleting
    db.delete(booking)
    db.commit()
    logger.info(f"Booking {booking_id} cancelled successfully by user ID: {current_user.id}")
    return {"message": "Booking cancelled successfully"} 