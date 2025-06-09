from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import logging # Import the logging module

from .. import schemas, models
from ..database import get_db
from ..utils import auth as auth_utils

# Configure logger for this module
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
    # Responses for common authentication errors
    responses={
        401: {"description": "Unauthorized - Invalid credentials"},
        403: {"description": "Forbidden - Not enough permissions"},
    },
)

# OAuth2 scheme for password-based authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

@router.post("/register", response_model=schemas.User, summary="Register a new user")
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Registers a new user with the provided email, name, and password.

    Args:
        user (schemas.UserCreate): User creation data.
        db (Session): Database session dependency.

    Raises:
        HTTPException: 400 if email is already registered.

    Returns:
        schemas.User: The newly created user.
    """
    logger.info(f"Attempting to register new user with email: {user.email}")
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        logger.warning(f"Registration failed: Email already registered ({user.email})")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    hashed_password = auth_utils.get_password_hash(user.password)
    db_user = models.User(email=user.email, name=user.name, passwordHash=hashed_password, role="user") # Default role as user
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    logger.info(f"User registered successfully: {db_user.email}")
    return db_user

@router.post("/login", response_model=schemas.Token, summary="Authenticate user and return JWT token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Authenticates a user and returns an access token upon successful login.

    Args:
        form_data (OAuth2PasswordRequestForm): OAuth2 form data containing username (email) and password.
        db (Session): Database session dependency.

    Raises:
        HTTPException: 401 if authentication fails.

    Returns:
        schemas.Token: Access token and token type.
    """
    logger.info(f"Attempting login for user: {form_data.username}")
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth_utils.verify_password(form_data.password, user.passwordHash):
        logger.warning(f"Login failed: Incorrect credentials for user {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth_utils.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_utils.create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    logger.info(f"User {user.email} logged in successfully. Role: {user.role}")
    return {"access_token": access_token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> models.User:
    """Dependency to get the current authenticated user from the JWT token.

    Args:
        token (str): JWT token from the Authorization header.
        db (Session): Database session dependency.

    Raises:
        HTTPException: 401 if credentials cannot be validated.

    Returns:
        models.User: The authenticated user object.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    logger.debug("Attempting to decode access token.")
    payload = auth_utils.decode_access_token(token)
    if payload is None:
        logger.warning("Failed to decode access token: Payload is None.")
        raise credentials_exception
    email: str = payload.get("sub")
    if email is None:
        logger.warning("Failed to decode access token: Email (sub) is missing from payload.")
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        logger.warning(f"User not found in DB for email from token: {email}")
        raise credentials_exception
    logger.info(f"Successfully retrieved current user: {user.email} with role: {user.role}")
    return user

def get_current_active_user(current_user: models.User = Depends(get_current_user)) -> models.User:
    """Dependency to get the current active authenticated user.

    This simply passes through the `current_user` obtained from `get_current_user`.

    Args:
        current_user (models.User): The user object from `get_current_user`.

    Returns:
        models.User: The active authenticated user object.
    """
    logger.debug(f"Getting current active user: {current_user.email}")
    return current_user

def get_current_admin_user(current_user: models.User = Depends(get_current_user)) -> models.User:
    """Dependency to get the current authenticated admin user.

    Args:
        current_user (models.User): The user object from `get_current_user`.

    Raises:
        HTTPException: 403 if the user is not an admin.

    Returns:
        models.User: The authenticated admin user object.
    """
    logger.info(f"Checking admin privileges for user: {current_user.email}")
    if current_user.role != "admin":
        logger.warning(f"Access denied: User {current_user.email} is not an admin.")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not an admin user")
    logger.info(f"Admin access granted for user: {current_user.email}")
    return current_user 