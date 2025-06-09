from sqlalchemy import Column, String, UUID, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base, TimestampMixin
import uuid

class User(Base, TimestampMixin):
    """SQLAlchemy model for users."""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(100))
    first_name = Column(String(100))
    last_name = Column(String(100))
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default='user')
    phone = Column(String(20))
    profile_image_url = Column(String(255))
    membership_id = Column(UUID(as_uuid=True), ForeignKey('memberships.id'))

    # Relationships
    membership = relationship("Membership", back_populates="users")
    bookings = relationship("Booking", back_populates="user")
    ownership_shares = relationship("OwnershipShare", back_populates="user")
    user_memberships = relationship("UserMembership", back_populates="user")

from .membership import Membership
from .user_membership import UserMembership
from .jet_category import JetCategory
from .jet import Jet
from .contact_info import ContactInfo
from .booking import Booking
from .ownership_share import OwnershipShare
from .category import Category
from .aircraft import Aircraft

__all__ = [
    'Base',
    'TimestampMixin',
    'User',
    'Membership',
    'UserMembership',
    'JetCategory',
    'Jet',
    'ContactInfo',
    'Booking',
    'OwnershipShare',
    'Category',
    'Aircraft'
] 