from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import schemas, models
from .auth import get_current_user, get_current_admin_user
import logging
import json
import traceback

# Configure logger
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

@router.get("/me", response_model=schemas.User)
async def get_current_user_data(current_user: models.User = Depends(get_current_user)):
    """Get the current user's data."""
    try:
        logger.info(f"Fetching data for user: {current_user.email}")
        # Convert the user model to a dict for logging
        user_dict = {
            'id': str(current_user.id),
            'email': current_user.email,
            'name': current_user.name,
            'first_name': current_user.first_name,
            'last_name': current_user.last_name,
            'role': current_user.role,
            'membership_id': str(current_user.membership_id) if current_user.membership_id else None,
            'created_at': current_user.created_at.isoformat() if current_user.created_at else None,
            'updated_at': current_user.updated_at.isoformat() if current_user.updated_at else None
        }
        logger.info(f"User data: {json.dumps(user_dict, indent=2)}")
        return current_user
    except Exception as e:
        logger.error(f"Error fetching user data: {str(e)}")
        logger.error(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching user data"
        )

@router.put("/me", response_model=schemas.User)
async def update_current_user(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update the current user's data."""
    try:
        logger.info(f"Updating data for user: {current_user.email}")
        logger.info(f"Update data: {json.dumps(user_update.dict(exclude_unset=True), indent=2)}")
        
        # Only allow role updates if the user is an admin
        if user_update.role is not None and current_user.role != "admin":
            logger.warning(f"User {current_user.email} attempted to update role without admin privileges")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can update user roles"
            )
        
        # Update user fields
        for field, value in user_update.dict(exclude_unset=True).items():
            if field == "password":
                # Hash the password before storing
                from ..utils.auth import get_password_hash
                current_user.password_hash = get_password_hash(value)
            else:
                setattr(current_user, field, value)
        
        db.add(current_user)
        db.commit()
        db.refresh(current_user)
        
        # Log the updated user data
        user_dict = {
            'id': str(current_user.id),
            'email': current_user.email,
            'name': current_user.name,
            'first_name': current_user.first_name,
            'last_name': current_user.last_name,
            'role': current_user.role,
            'membership_id': str(current_user.membership_id) if current_user.membership_id else None,
            'created_at': current_user.created_at.isoformat() if current_user.created_at else None,
            'updated_at': current_user.updated_at.isoformat() if current_user.updated_at else None
        }
        logger.info(f"Updated user data: {json.dumps(user_dict, indent=2)}")
        
        return current_user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user data: {str(e)}")
        logger.error(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating user data"
        )

@router.get("/{user_id}", response_model=schemas.User)
async def get_user(
    user_id: str,
    current_user: models.User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get a specific user's data (admin only)."""
    try:
        logger.info(f"Admin {current_user.email}: Fetching data for user ID: {user_id}")
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            logger.warning(f"Admin {current_user.email}: User not found with ID: {user_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Log the user data
        user_dict = {
            'id': str(user.id),
            'email': user.email,
            'name': user.name,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'membership_id': str(user.membership_id) if user.membership_id else None,
            'created_at': user.created_at.isoformat() if user.created_at else None,
            'updated_at': user.updated_at.isoformat() if user.updated_at else None
        }
        logger.info(f"Admin {current_user.email}: User data: {json.dumps(user_dict, indent=2)}")
        
        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Admin {current_user.email}: Error fetching user data: {str(e)}")
        logger.error(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching user data"
        )

@router.put("/{user_id}", response_model=schemas.User)
async def update_user(
    user_id: str,
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update a specific user's data (admin only)."""
    try:
        logger.info(f"Admin {current_user.email}: Updating data for user ID: {user_id}")
        logger.info(f"Admin {current_user.email}: Update data: {json.dumps(user_update.dict(exclude_unset=True), indent=2)}")
        
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            logger.warning(f"Admin {current_user.email}: User not found with ID: {user_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Update user fields
        for field, value in user_update.dict(exclude_unset=True).items():
            if field == "password":
                # Hash the password before storing
                from ..utils.auth import get_password_hash
                user.password_hash = get_password_hash(value)
            else:
                setattr(user, field, value)
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Log the updated user data
        user_dict = {
            'id': str(user.id),
            'email': user.email,
            'name': user.name,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'membership_id': str(user.membership_id) if user.membership_id else None,
            'created_at': user.created_at.isoformat() if user.created_at else None,
            'updated_at': user.updated_at.isoformat() if user.updated_at else None
        }
        logger.info(f"Admin {current_user.email}: Updated user data: {json.dumps(user_dict, indent=2)}")
        
        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Admin {current_user.email}: Error updating user data: {str(e)}")
        logger.error(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating user data"
        ) 