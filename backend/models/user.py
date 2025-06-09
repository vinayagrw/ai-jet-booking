from sqlalchemy import Column, String, UUID, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin
import uuid

class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100))
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default='user')
    first_name = Column(String(100))
    last_name = Column(String(100))
    phone = Column(String(20))
    profile_image_url = Column(String(255))
    membership_id = Column(UUID(as_uuid=True), ForeignKey('memberships.id'))

    # Relationships
    membership = relationship("Membership", back_populates="users")
    user_memberships = relationship("UserMembership", back_populates="user")
    bookings = relationship("Booking", back_populates="user")
    ownership_shares = relationship("OwnershipShare", back_populates="user") 