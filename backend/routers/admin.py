from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import logging # Import the logging module
import json
import traceback

from .. import schemas, models
from ..database import get_db
from ..utils import auth as auth_utils # Import auth_utils for password hashing
from .auth import get_current_admin_user # Admin-specific dependency

# Configure logger for this module
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    # Common responses for admin routes
    responses={
        401: {"description": "Unauthorized - Admin credentials required"},
        403: {"description": "Forbidden - Not an admin user"},
        404: {"description": "Resource not found"},
    },
    # All routes in this router require admin privileges
    dependencies=[Depends(get_current_admin_user)]
)

# --- User Management Endpoints ---

@router.get("/users/", response_model=List[schemas.User], summary="Get all users (Admin only)")
def get_all_users(
    db: Session = Depends(get_db)
):
    """Retrieve a list of all users in the system.\n\n    Requires admin privileges.\n
    Args:\n        db (Session): Database session dependency.\n
    Returns:\n        List[schemas.User]: A list of all user objects.\n
    """
    logger.info("Admin: Fetching all users.")
    users = db.query(models.User).all()
    logger.info(f"Admin: Retrieved {len(users)} users.")
    return users

@router.get("/users/{user_id}", response_model=schemas.User, summary="Get user by ID (Admin only)")
def get_user_by_id(
    user_id: UUID,
    db: Session = Depends(get_db)
):
    """Retrieve details of a specific user by their ID.\n\n    Requires admin privileges.\n
    Args:\n        user_id (UUID): The unique identifier of the user.\n        db (Session): Database session dependency.\n
    Raises:\n        HTTPException: 404 if the user is not found.\n
    Returns:\n        schemas.User: The user object.\n    """
    logger.info(f"Admin: Attempting to retrieve user with ID: {user_id}")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        logger.warning(f"Admin: User with ID {user_id} not found.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    logger.info(f"Admin: Successfully retrieved user with ID: {user_id}")
    return user

@router.post("/users/", response_model=schemas.User, status_code=status.HTTP_201_CREATED, summary="Create a new user (Admin only)")
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    """Create a new user in the system.\n\n    Requires admin privileges.\n
    Args:\n        user (schemas.UserCreate): The user data to create.\n        db (Session): Database session dependency.\n
    Raises:\n        HTTPException: 400 if the email is already registered.\n
    Returns:\n        schemas.User: The newly created user object.\n    """
    logger.info(f"Admin: Attempting to create new user with email: {user.email}")
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        logger.warning(f"Admin: User creation failed, email already registered: {user.email}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    hashed_password = auth_utils.get_password_hash(user.password)
    # Admin can create any user, including other admins if 'role' field was exposed in schema
    # For simplicity, default role is 'user' or whatever is set in models.
    db_user = models.User(email=user.email, name=user.name, passwordHash=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    logger.info(f"Admin: User created successfully with ID: {db_user.id}, email: {db_user.email}")
    return db_user

@router.put("/users/{user_id}", response_model=schemas.User, summary="Update user details (Admin only)")
def update_user(
    user_id: UUID,
    user_update: schemas.UserCreate, # Reusing UserCreate for update. In a real app, a UserUpdate schema might be better.
    db: Session = Depends(get_db)
):
    """Update details for a specific user.\n\n    Requires admin privileges.\n
    Args:\n        user_id (UUID): The unique identifier of the user to update.\n        user_update (schemas.UserCreate): The updated user data.\n        db (Session): Database session dependency.\n
    Raises:\n        HTTPException: 404 if the user is not found.\n
    Returns:\n        schemas.User: The updated user object.\n    """
    logger.info(f"Admin: Attempting to update user with ID: {user_id}")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        logger.warning(f"Admin: User with ID {user_id} not found for update.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    for key, value in user_update.dict(exclude_unset=True).items():
        if key == "password": # Handle password hashing if password is being updated
            user.passwordHash = auth_utils.get_password_hash(value)
            logger.info(f"Admin: Password updated for user ID: {user_id}")
        else:
            setattr(user, key, value)
            logger.debug(f"Admin: Setting attribute {key} for user ID: {user_id}")
            
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info(f"Admin: User {user_id} updated successfully.")
    return user

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a user (Admin only)")
def delete_user(
    user_id: UUID,
    db: Session = Depends(get_db)
):
    """Delete a specific user from the system.\n\n    Requires admin privileges.\n
    Args:\n        user_id (UUID): The unique identifier of the user to delete.\n        db (Session): Database session dependency.\n
    Raises:\n        HTTPException: 404 if the user is not found.\n
    Returns:\n        dict: A confirmation message upon successful deletion.\n    """
    logger.info(f"Admin: Attempting to delete user with ID: {user_id}")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        logger.warning(f"Admin: User with ID {user_id} not found for deletion.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    db.delete(user)
    db.commit()
    logger.info(f"Admin: User {user_id} deleted successfully.")
    return {"message": "User deleted successfully"}

# --- Jet Management Endpoints ---

@router.get("/jets/", response_model=List[schemas.Jet], summary="Get all jets (Admin only)")
def get_all_jets(
    db: Session = Depends(get_db)
):
    """Retrieve a list of all jets in the system.\n\n    Requires admin privileges.\n
    Args:\n        db (Session): Database session dependency.\n
    Returns:\n        List[schemas.Jet]: A list of all jet objects.\n
    """
    logger.info("Admin: Fetching all jets.")
    jets = db.query(models.Jet).all()
    logger.info(f"Admin: Retrieved {len(jets)} jets.")
    return jets

@router.post("/jets/", response_model=schemas.Jet, status_code=status.HTTP_201_CREATED, summary="Create a new jet (Admin only)")
def create_jet(
    jet: schemas.JetCreate,
    db: Session = Depends(get_db)
):
    """Create a new private jet entry in the system.\n\n    Requires admin privileges.\n
    Args:\n        jet (schemas.JetCreate): The jet data to create.\n        db (Session): Database session dependency.\n
    Returns:\n        schemas.Jet: The newly created jet object.\n    """
    logger.info(f"Admin: Attempting to create new jet with name: {jet.name}")
    db_jet = models.Jet(**jet.dict())
    db.add(db_jet)
    db.commit()
    db.refresh(db_jet)
    logger.info(f"Admin: Jet created successfully with ID: {db_jet.id}, name: {db_jet.name}")
    return db_jet

@router.put("/jets/{jet_id}", response_model=schemas.Jet, summary="Update jet details (Admin only)")
def update_jet(
    jet_id: UUID,
    jet_update: schemas.JetCreate, # Reusing JetCreate for update. In a real app, a JetUpdate schema might be better.
    db: Session = Depends(get_db)
):
    """Update details for a specific jet.\n\n    Requires admin privileges.\n
    Args:\n        jet_id (UUID): The unique identifier of the jet to update.\n        jet_update (schemas.JetCreate): The updated jet data.\n        db (Session): Database session dependency.\n
    Raises:\n        HTTPException: 404 if the jet is not found.\n
    Returns:\n        schemas.Jet: The updated jet object.\n    """
    logger.info(f"Admin: Attempting to update jet with ID: {jet_id}")
    jet = db.query(models.Jet).filter(models.Jet.id == jet_id).first()
    if not jet:
        logger.warning(f"Admin: Jet with ID {jet_id} not found for update.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Jet not found")
    
    for key, value in jet_update.dict(exclude_unset=True).items():
        setattr(jet, key, value)
        logger.debug(f"Admin: Setting attribute {key} for jet ID: {jet_id}")
            
    db.add(jet)
    db.commit()
    db.refresh(jet)
    logger.info(f"Admin: Jet {jet_id} updated successfully.")
    return jet

@router.delete("/jets/{jet_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a jet (Admin only)")
def delete_jet(
    jet_id: UUID,
    db: Session = Depends(get_db)
):
    """Delete a specific jet from the system.\n\n    Requires admin privileges.\n
    Args:\n        jet_id (UUID): The unique identifier of the jet to delete.\n        db (Session): Database session dependency.\n
    Raises:\n        HTTPException: 404 if the jet is not found.\n
    Returns:\n        dict: A confirmation message upon successful deletion.\n    """
    logger.info(f"Admin: Attempting to delete jet with ID: {jet_id}")
    jet = db.query(models.Jet).filter(models.Jet.id == jet_id).first()
    if not jet:
        logger.warning(f"Admin: Jet with ID {jet_id} not found for deletion.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Jet not found")
    db.delete(jet)
    db.commit()
    logger.info(f"Admin: Jet {jet_id} deleted successfully.")
    return {"message": "Jet deleted successfully"}

# --- Booking Management Endpoints ---

@router.get("/bookings/", response_model=List[schemas.Booking], summary="Get all bookings (Admin only)")
def get_all_bookings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """Retrieve a list of all bookings in the system."""
    try:
        logger.info(f"Admin {current_user.email}: Fetching all bookings")
        bookings = db.query(models.Booking).all()
        
        # Log the number of bookings found
        logger.info(f"Admin {current_user.email}: Retrieved {len(bookings)} bookings")
        
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
            logger.info(f"Admin {current_user.email}: Booking data: {json.dumps(booking_dict, indent=2)}")
            
        return bookings
    except Exception as e:
        logger.error(f"Admin {current_user.email}: Error fetching bookings: {str(e)}")
        logger.error(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching bookings"
        )

@router.put("/bookings/{booking_id}", response_model=schemas.Booking, summary="Update booking details (Admin only)")
def update_booking(
    booking_id: UUID,
    booking_update: schemas.BookingCreate, # Reusing BookingCreate for update.
    db: Session = Depends(get_db)
):
    """Update details for a specific booking.\n\n    Requires admin privileges.\n
    Args:\n        booking_id (UUID): The unique identifier of the booking to update.\n        booking_update (schemas.BookingCreate): The updated booking data.\n        db (Session): Database session dependency.\n
    Raises:\n        HTTPException: 404 if the booking is not found.\n
    Returns:\n        schemas.Booking: The updated booking object.\n    """
    logger.info(f"Admin: Attempting to update booking with ID: {booking_id}")
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        logger.warning(f"Admin: Booking with ID {booking_id} not found for update.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    
    for key, value in booking_update.dict(exclude_unset=True).items():
        setattr(booking, key, value)
        logger.debug(f"Admin: Setting attribute {key} for booking ID: {booking_id}")
            
    db.add(booking)
    db.commit()
    db.refresh(booking)
    logger.info(f"Admin: Booking {booking_id} updated successfully.")
    return booking

@router.delete("/bookings/{booking_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a booking (Admin only)")
def delete_booking(
    booking_id: UUID,
    db: Session = Depends(get_db)
):
    """Delete a specific booking from the system.\n\n    Requires admin privileges.\n
    Args:\n        booking_id (UUID): The unique identifier of the booking to delete.\n        db (Session): Database session dependency.\n
    Raises:\n        HTTPException: 404 if the booking is not found.\n
    Returns:\n        dict: A confirmation message upon successful deletion.\n    """
    logger.info(f"Admin: Attempting to delete booking with ID: {booking_id}")
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        logger.warning(f"Admin: Booking with ID {booking_id} not found for deletion.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    db.delete(booking)
    db.commit()
    logger.info(f"Admin: Booking {booking_id} deleted successfully.")
    return {"message": "Booking deleted successfully"}

# --- Membership Management Endpoints ---

@router.get("/memberships/", response_model=List[schemas.Membership], summary="Get all memberships (Admin only)")
def get_all_memberships(
    db: Session = Depends(get_db)
):
    """Retrieve a list of all membership plans in the system.\n\n    Requires admin privileges.\n
    Args:\n        db (Session): Database session dependency.\n
    Returns:\n        List[schemas.Membership]: A list of all membership objects.\n    """
    logger.info("Admin: Fetching all memberships.")
    memberships = db.query(models.Membership).all()
    logger.info(f"Admin: Retrieved {len(memberships)} memberships.")
    return memberships

@router.post("/memberships/", response_model=schemas.Membership, status_code=status.HTTP_201_CREATED, summary="Create a new membership (Admin only)")
def create_membership(
    membership: schemas.MembershipCreate,
    db: Session = Depends(get_db)
):
    """Create a new membership plan in the system.\n\n    Requires admin privileges.\n
    Args:\n        membership (schemas.MembershipCreate): The membership data to create.\n        db (Session): Database session dependency.\n
    Returns:\n        schemas.Membership: The newly created membership object.\n    """
    logger.info(f"Admin: Attempting to create new membership with name: {membership.name}")
    db_membership = models.Membership(**membership.dict())
    db.add(db_membership)
    db.commit()
    db.refresh(db_membership)
    logger.info(f"Admin: Membership created successfully with ID: {db_membership.id}, name: {db_membership.name}")
    return db_membership

@router.put("/memberships/{membership_id}", response_model=schemas.Membership, summary="Update membership details (Admin only)")
def update_membership(
    membership_id: UUID,
    membership_update: schemas.MembershipCreate, # Reusing MembershipCreate for update
    db: Session = Depends(get_db)
):
    """Update details for a specific membership.\n\n    Requires admin privileges.\n
    Args:\n        membership_id (UUID): The unique identifier of the membership to update.\n        membership_update (schemas.MembershipCreate): The updated membership data.\n        db (Session): Database session dependency.\n
    Raises:\n        HTTPException: 404 if the membership is not found.\n
    Returns:\n        schemas.Membership: The updated membership object.\n    """
    logger.info(f"Admin: Attempting to update membership with ID: {membership_id}")
    membership = db.query(models.Membership).filter(models.Membership.id == membership_id).first()
    if not membership:
        logger.warning(f"Admin: Membership with ID {membership_id} not found for update.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Membership not found")
    
    for key, value in membership_update.dict(exclude_unset=True).items():
        setattr(membership, key, value)
        logger.debug(f"Admin: Setting attribute {key} for membership ID: {membership_id}")
            
    db.add(membership)
    db.commit()
    db.refresh(membership)
    logger.info(f"Admin: Membership {membership_id} updated successfully.")
    return membership

@router.delete("/memberships/{membership_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a membership (Admin only)")
def delete_membership(
    membership_id: UUID,
    db: Session = Depends(get_db)
):
    """Delete a specific membership from the system.\n\n    Requires admin privileges.\n
    Args:\n        membership_id (UUID): The unique identifier of the membership to delete.\n        db (Session): Database session dependency.\n
    Raises:\n        HTTPException: 404 if the membership is not found.\n
    Returns:\n        dict: A confirmation message upon successful deletion.\n    """
    logger.info(f"Admin: Attempting to delete membership with ID: {membership_id}")
    membership = db.query(models.Membership).filter(models.Membership.id == membership_id).first()
    if not membership:
        logger.warning(f"Admin: Membership with ID {membership_id} not found for deletion.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Membership not found")
    db.delete(membership)
    db.commit()
    logger.info(f"Admin: Membership {membership_id} deleted successfully.")
    return {"message": "Membership deleted successfully"}

# --- Ownership Share Management Endpoints ---

@router.get("/ownership-shares/", response_model=List[schemas.OwnershipShare], summary="Get all ownership shares (Admin only)")
def get_all_ownership_shares(
    db: Session = Depends(get_db)
):
    """Retrieve a list of all ownership shares in the system.\n\n    Requires admin privileges.\n
    Args:\n        db (Session): Database session dependency.\n
    Returns:\n        List[schemas.OwnershipShare]: A list of all ownership share objects.\n    """
    logger.info("Admin: Fetching all ownership shares.")
    shares = db.query(models.OwnershipShare).all()
    logger.info(f"Admin: Retrieved {len(shares)} ownership shares.")
    return shares

@router.post("/ownership-shares/", response_model=schemas.OwnershipShare, status_code=status.HTTP_201_CREATED, summary="Create a new ownership share (Admin only)")
def create_ownership_share(
    share: schemas.OwnershipShareCreate,
    db: Session = Depends(get_db)
):
    """Create a new ownership share entry in the system.\n\n    Requires admin privileges.\n
    Args:\n        share (schemas.OwnershipShareCreate): The ownership share data to create.\n        db (Session): Database session dependency.\n
    Returns:\n        schemas.OwnershipShare: The newly created ownership share object.\n    """
    logger.info(f"Admin: Attempting to create new ownership share for jet ID: {share.jetId} and user ID: {share.userId}")
    db_share = models.OwnershipShare(**share.dict())
    db.add(db_share)
    db.commit()
    db.refresh(db_share)
    logger.info(f"Admin: Ownership share created successfully with ID: {db_share.id}")
    return db_share

@router.put("/ownership-shares/{share_id}", response_model=schemas.OwnershipShare, summary="Update ownership share details (Admin only)")
def update_ownership_share(
    share_id: UUID,
    share_update: schemas.OwnershipShareCreate, # Reusing for update
    db: Session = Depends(get_db)
):
    """Update details for a specific ownership share.\n\n    Requires admin privileges.\n
    Args:\n        share_id (UUID): The unique identifier of the ownership share to update.\n        share_update (schemas.OwnershipShareCreate): The updated ownership share data.\n        db (Session): Database session dependency.\n
    Raises:\n        HTTPException: 404 if the ownership share is not found.\n
    Returns:\n        schemas.OwnershipShare: The updated ownership share object.\n    """
    logger.info(f"Admin: Attempting to update ownership share with ID: {share_id}")
    share = db.query(models.OwnershipShare).filter(models.OwnershipShare.id == share_id).first()
    if not share:
        logger.warning(f"Admin: Ownership share with ID {share_id} not found for update.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ownership share not found")
    
    for key, value in share_update.dict(exclude_unset=True).items():
        setattr(share, key, value)
        logger.debug(f"Admin: Setting attribute {key} for ownership share ID: {share_id}")
            
    db.add(share)
    db.commit()
    db.refresh(share)
    logger.info(f"Admin: Ownership share {share_id} updated successfully.")
    return share

@router.delete("/ownership-shares/{share_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete an ownership share (Admin only)")
def delete_ownership_share(
    share_id: UUID,
    db: Session = Depends(get_db)
):
    """Delete a specific ownership share from the system.\n\n    Requires admin privileges.\n
    Args:\n        share_id (UUID): The unique identifier of the ownership share to delete.\n        db (Session): Database session dependency.\n
    Raises:\n        HTTPException: 404 if the ownership share is not found.\n
    Returns:\n        dict: A confirmation message upon successful deletion.\n    """
    logger.info(f"Admin: Attempting to delete ownership share with ID: {share_id}")
    share = db.query(models.OwnershipShare).filter(models.OwnershipShare.id == share_id).first()
    if not share:
        logger.warning(f"Admin: Ownership share with ID {share_id} not found for deletion.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ownership share not found")
    db.delete(share)
    db.commit()
    logger.info(f"Admin: Ownership share {share_id} deleted successfully.")
    return {"message": "Ownership share deleted successfully"} 