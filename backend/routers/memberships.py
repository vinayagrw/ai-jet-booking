from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
import logging # Import the logging module

from .. import schemas, models
from ..database import get_db
from .auth import get_current_active_user, get_current_admin_user

# Configure logger for this module
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/memberships",
    tags=["Memberships"],
    responses={
        401: {"description": "Unauthorized - User not logged in or token invalid"},
        403: {"description": "Forbidden - Not authorized to perform action"},
        404: {"description": "Membership or user not found"},
    },
)

@router.get("/", response_model=List[schemas.Membership], summary="Get all available membership plans")
def get_memberships(
    db: Session = Depends(get_db)
):
    """Retrieve a list of all available private jet membership plans.\n\n    Args:\n        db (Session): Database session dependency.\n
    Returns:\n        List[schemas.Membership]: A list of membership plan objects.\n    """
    logger.info("Fetching all available membership plans.")
    memberships = db.query(models.Membership).all()
    logger.info(f"Retrieved {len(memberships)} membership plans.")
    return memberships

@router.get("/{membership_id}", response_model=schemas.Membership, summary="Get a specific membership plan")
def get_membership(
    membership_id: UUID,
    db: Session = Depends(get_db)
):
    """Retrieve a specific membership plan by ID.\n\n    Args:\n        membership_id (UUID): The ID of the membership plan to retrieve.\n        db (Session): Database session dependency.\n
    Raises:\n        HTTPException: 404 if the membership plan is not found.\n
    Returns:\n        schemas.Membership: The membership plan object.\n    """
    logger.info(f"Fetching membership plan with ID: {membership_id}")
    membership = db.query(models.Membership).filter(models.Membership.id == membership_id).first()
    if not membership:
        logger.warning(f"Membership plan not found with ID: {membership_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Membership plan not found")
    logger.info(f"Successfully retrieved membership plan {membership_id}")
    return membership

@router.post("/enroll", response_model=schemas.User, summary="Enroll a user in a membership plan")
def enroll_membership(
    userId: UUID,
    membershipId: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Enroll the current authenticated user in a specified membership plan.\n\n    Requires authentication.\n\n    Args:\n        userId (UUID): The ID of the user to enroll (must match current authenticated user).\n        membershipId (UUID): The ID of the membership plan to enroll in.\n        db (Session): Database session dependency.\n        current_user (models.User): The currently authenticated user.\n
    Raises:\n        HTTPException: 403 if the authenticated user tries to enroll another user.\n        HTTPException: 404 if the user or membership plan is not found.\n
    Returns:\n        schemas.User: The updated user object with the new membership assigned.\n    """
    logger.info(f"Attempting to enroll user {userId} into membership {membershipId} by current user {current_user.id}")
    if current_user.id != userId:
        logger.warning(f"User {current_user.id} attempted to enroll another user {userId} in a membership.")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot enroll membership for other users")

    user = db.query(models.User).filter(models.User.id == userId).first()
    if not user:
        logger.warning(f"Enrollment failed: User {userId} not found.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    membership = db.query(models.Membership).filter(models.Membership.id == membershipId).first()
    if not membership:
        logger.warning(f"Enrollment failed: Membership {membershipId} not found.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Membership not found")

    user.membershipId = membershipId
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info(f"User {userId} successfully enrolled in membership {membershipId}.")
    return user

@router.get("/users/{user_id}/membership", response_model=Optional[schemas.Membership], summary="Get a user's current membership plan")
def get_user_membership(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Retrieve the current membership plan for a specific user.\n\n    Requires authentication. Users can view their own membership; admins can view any user's membership.\n
    Args:\n        user_id (UUID): The ID of the user whose membership to retrieve.\n        db (Session): Database session dependency.\n        current_user (models.User): The currently authenticated user.\n
    Raises:\n        HTTPException: 403 if not authorized to view this user's membership.\n        HTTPException: 404 if the user is not found.\n
    Returns:\n        Optional[schemas.Membership]: The user's membership object, or None if no membership.
    """
    logger.info(f"Attempting to retrieve membership for user {user_id} by current user {current_user.id}")
    if current_user.id != user_id and current_user.role != "admin":
        logger.warning(f"Access denied: User {current_user.id} not authorized to view membership of user {user_id}.")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this user's membership")
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        logger.warning(f"Membership retrieval failed: User {user_id} not found.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.membershipId:
        membership = db.query(models.Membership).filter(models.Membership.id == user.membershipId).first()
        if membership:
            logger.info(f"Successfully retrieved membership {membership.id} for user {user_id}.")
            return membership
        else:
            logger.warning(f"Membership ID {user.membershipId} not found for user {user_id}. Returning None.")
            return None
    logger.info(f"User {user_id} has no assigned membership. Returning None.")
    return None 