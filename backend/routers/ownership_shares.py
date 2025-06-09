from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import logging # Import the logging module

from .. import schemas, models
from ..database import get_db
from .auth import get_current_active_user, get_current_admin_user

# Configure logger for this module
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/ownership-shares",
    tags=["Ownership Shares"],
    responses={
        401: {"description": "Unauthorized - User not logged in or token invalid"},
        403: {"description": "Forbidden - Not authorized to perform action"},
        404: {"description": "Ownership share or associated resource not found"},
    },
)

@router.get("/", response_model=List[schemas.OwnershipShare], summary="Get all ownership shares for the current user")
def get_user_ownership_shares(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Retrieve a list of all ownership shares held by the currently authenticated user.\n\n    Requires authentication.\n\n    Args:\n        db (Session): Database session dependency.\n        current_user (models.User): The currently authenticated user.\n\n    Returns:\n        List[schemas.OwnershipShare]: A list of ownership share objects for the current user.\n    """
    logger.info(f"Fetching ownership shares for user ID: {current_user.id}")
    shares = db.query(models.OwnershipShare).filter(models.OwnershipShare.userId == current_user.id).all()
    logger.info(f"Retrieved {len(shares)} ownership shares for user ID: {current_user.id}")
    return shares

@router.get("/{share_id}", response_model=schemas.OwnershipShare, summary="Get details of a specific ownership share")
def get_ownership_share_details(
    share_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Retrieve details of a specific ownership share by its ID.\n\n    Requires authentication. Only the owner of the share or an admin can view details.\n\n    Args:\n        share_id (UUID): The unique identifier of the ownership share.\n        db (Session): Database session dependency.\n        current_user (models.User): The currently authenticated user.\n\n    Raises:\n        HTTPException: 404 if the share is not found or not authorized for the current user.\n\n    Returns:\n        schemas.OwnershipShare: The ownership share object.\n    """
    logger.info(f"Attempting to retrieve ownership share {share_id} for user ID: {current_user.id}")
    share = db.query(models.OwnershipShare).filter(models.OwnershipShare.id == share_id, models.OwnershipShare.userId == current_user.id).first()
    if not share:
        logger.warning(f"Ownership share {share_id} not found or not authorized for user ID: {current_user.id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ownership share not found or not authorized")
    logger.info(f"Successfully retrieved ownership share {share_id} for user ID: {current_user.id}")
    return share

@router.post("/", response_model=schemas.OwnershipShare, summary="Purchase a new ownership share")
def purchase_ownership_share(
    share: schemas.OwnershipShareCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Purchase a new ownership share for a private jet.\n\n    Requires authentication. The share must be purchased by the currently authenticated user.\n\n    Args:\n        share (schemas.OwnershipShareCreate): Details of the ownership share to purchase.\n        db (Session): Database session dependency.\n        current_user (models.User): The currently authenticated user.\n\n    Raises:\n        HTTPException: 403 if the user tries to purchase a share for another user.\n\n    Returns:\n        schemas.OwnershipShare: The newly created ownership share object.\n    """
    logger.info(f"Attempting to purchase ownership share for user ID: {current_user.id} for jet ID: {share.jetId}")
    if current_user.id != share.userId:
        logger.warning(f"User {current_user.id} attempted to purchase share for another user {share.userId}.")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot purchase shares for other users")
    
    # In a real application, there would be payment processing and more complex business logic
    db_share = models.OwnershipShare(**share.dict())
    db.add(db_share)
    db.commit()
    db.refresh(db_share)
    logger.info(f"Ownership share {db_share.id} purchased successfully by user ID: {current_user.id}")
    return db_share 