from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..database import get_db
from .. import schemas, models
from uuid import UUID
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
import logging
from typing import Optional
import traceback
from jwt.exceptions import InvalidTokenError

# Configure logger
logger = logging.getLogger(__name__)

# Configure password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configure JWT
SECRET_KEY = "your-secret-key-here"  # In production, use a secure secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login endpoint that returns a JWT token."""
    try:
        # Find user by email
        user = db.query(models.User).filter(models.User.email == form_data.username).first()
        if not user:
            logger.warning(f"Login attempt failed: User not found with email {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Verify password
        if not verify_password(form_data.password, user.password_hash):
            logger.warning(f"Login attempt failed: Invalid password for user {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={
                "sub": user.email,
                "id": str(user.id),
                "role": user.role  # Add role to token data
            },
            expires_delta=access_token_expires
        )

        logger.info(f"User {user.email} logged in successfully")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login"
        )

@router.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Registration attempt for email: {user.email}")
    try:
        # Check if user already exists
        existing_user = db.query(models.User).filter(models.User.email == user.email).first()
        if existing_user:
            logger.warning(f"Registration failed: Email already exists: {user.email}")
            raise HTTPException(status_code=400, detail="Email already registered")
        logger.info("Hashing password...")
        hashed_password = get_password_hash(user.password)
        logger.info("Creating new user object...")
        db_user = models.User(
            email=user.email,
            name=user.name,
            first_name=getattr(user, 'first_name', None),
            last_name=getattr(user, 'last_name', None),
            password_hash=hashed_password,
            role='user'
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        logger.info(f"User created successfully: {db_user.email} (id: {db_user.id})")
        access_token = create_access_token(data={"sub": db_user.email, "role": db_user.role, "id": str(db_user.id)})
        logger.info(f"Access token created for user: {db_user.email}")
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        logger.error(f"Registration error for email {user.email}: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error during registration")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> models.User:
    """Get the current user from the JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        logger.info("Attempting to decode JWT token")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        user_id: str = payload.get("id")
        
        if email is None:
            logger.error("Token missing 'sub' claim")
            raise credentials_exception
            
        logger.info(f"Token decoded successfully for user: {email}")
        
        user = db.query(models.User).filter(models.User.email == email).first()
        if user is None:
            logger.error(f"User not found in database: {email}")
            raise credentials_exception
            
        # Verify that the user's role matches the token
        if user.role != role:
            logger.warning(f"Role mismatch for user {email}: token role {role} != db role {user.role}")
            raise credentials_exception
            
        # Verify that the user's ID matches the token
        if str(user.id) != user_id:
            logger.warning(f"ID mismatch for user {email}: token id {user_id} != db id {user.id}")
            raise credentials_exception
            
        logger.info(f"Successfully authenticated user: {email}")
        return user
        
    except InvalidTokenError as e:
        logger.error(f"Invalid JWT token: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except Exception as e:
        logger.error(f"Unexpected error during authentication: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during authentication"
        )

def get_current_active_user(current_user: models.User = Depends(get_current_user)) -> models.User:
    """Get the current active user."""
    return current_user

def get_current_admin_user(current_user: models.User = Depends(get_current_user)) -> models.User:
    """Get the current admin user."""
    try:
        logger.info(f"Checking admin privileges for user: {current_user.email}")
        if current_user.role != "admin":
            logger.warning(f"Access denied: User {current_user.email} is not an admin")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions. Admin access required."
            )
        logger.info(f"Admin access granted for user: {current_user.email}")
        return current_user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error checking admin privileges: {str(e)}")
        logger.error(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while checking admin privileges"
        ) 