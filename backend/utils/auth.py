import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from typing import Optional
import logging # Import the logging module

from passlib.context import CryptContext
from jose import JWTError, jwt

# Configure logger for this module
logger = logging.getLogger(__name__)

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key")  # Secret key for JWT encoding/decoding. Load from environment, default for dev.
ALGORITHM = "HS256" # Algorithm used for JWT encoding.
ACCESS_TOKEN_EXPIRE_MINUTES = 30 # Expiration time for access tokens in minutes.

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain-text password against a hashed password.

    Args:
        plain_password (str): The plain-text password to verify.
        hashed_password (str): The hashed password to compare against.

    Returns:
        bool: True if the passwords match, False otherwise.
    """
    result = pwd_context.verify(plain_password, hashed_password)
    if result:
        logger.info("Password verification successful.")
    else:
        logger.warning("Password verification failed.")
    return result

def get_password_hash(password: str) -> str:
    """Hashes a plain-text password.

    Args:
        password (str): The plain-text password to hash.

    Returns:
        str: The hashed password.
    """
    hashed_password = pwd_context.hash(password)
    logger.info("Password hashed successfully.")
    return hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Creates a JWT access token.

    Args:
        data (dict): The data to encode into the token (e.g., user ID, role).
        expires_delta (Optional[timedelta]): Optional timedelta for token expiration. If None, uses default.

    Returns:
        str: The encoded JWT access token.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    logger.info(f"Access token created for user: {data.get('sub')}")
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """Decodes a JWT access token.

    Args:
        token (str): The JWT access token to decode.

    Returns:
        Optional[dict]: The decoded payload if valid, otherwise None.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        logger.info("Access token decoded successfully.")
        return payload
    except JWTError as e:
        logger.warning(f"JWT decoding failed: {e}")
        return None 