from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Enum, Text, ARRAY, DECIMAL, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import uuid

from .database import Base

class User(Base):
    """SQLAlchemy model for users."""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100))
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="user")
    first_name = Column(String(100))
    last_name = Column(String(100))
    phone = Column(String(20))
    profile_image_url = Column(String(255))
    membership_id = Column(UUID(as_uuid=True), ForeignKey("memberships.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    membership = relationship("Membership", back_populates="users")
    bookings = relationship("Booking", back_populates="user")
    ownership_shares = relationship("OwnershipShare", back_populates="user")

class JetCategory(Base):
    __tablename__ = "jet_categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    image_url = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    jets = relationship("Jet", back_populates="category")

class Jet(Base):
    """SQLAlchemy model for jets."""
    __tablename__ = "jets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    manufacturer = Column(String(100), nullable=False)
    category_id = Column(UUID(as_uuid=True), ForeignKey("jet_categories.id"))
    year = Column(Integer)
    max_speed_mph = Column(Integer)
    max_passengers = Column(Integer)
    price_per_hour = Column(DECIMAL(10,2))
    cabin_height_ft = Column(DECIMAL(4,1))
    cabin_width_ft = Column(DECIMAL(4,1))
    cabin_length_ft = Column(DECIMAL(4,1))
    baggage_capacity_cuft = Column(Integer)
    takeoff_distance_ft = Column(Integer)
    landing_distance_ft = Column(Integer)
    fuel_capacity_lbs = Column(Integer)
    image_url = Column(String(255))
    gallery_urls = Column(ARRAY(Text))
    features = Column(ARRAY(Text))
    amenities = Column(ARRAY(Text))
    status = Column(String(50), nullable=False, default="available")
    range_nm = Column(Integer, nullable=False)
    location = Column(String(255), nullable=True)  # Base location of the jet
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    category = relationship("JetCategory", back_populates="jets")
    bookings = relationship("Booking", back_populates="jet")
    ownership_shares = relationship("OwnershipShare", back_populates="jet")

class Booking(Base):
    """SQLAlchemy model for bookings."""
    __tablename__ = "bookings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    jet_id = Column(UUID(as_uuid=True), ForeignKey("jets.id"))
    origin = Column(String(255), nullable=False)
    destination = Column(String(255), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(20), nullable=False, default="pending")
    passengers = Column(Integer, nullable=False, default=1)
    special_requests = Column(Text)
    total_price = Column(DECIMAL(10,2))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="bookings")
    jet = relationship("Jet", back_populates="bookings")

class Membership(Base):
    """SQLAlchemy model for membership plans."""
    __tablename__ = "memberships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    price = Column(DECIMAL(10,2))
    duration_months = Column(Integer)
    benefits = Column(ARRAY(Text))
    image_url = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    users = relationship("User", back_populates="membership")
    user_memberships = relationship("UserMembership", back_populates="membership")

class OwnershipShare(Base):
    """SQLAlchemy model for ownership shares."""
    __tablename__ = "ownership_shares"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    jet_id = Column(UUID(as_uuid=True), ForeignKey("jets.id"))
    share_fraction = Column(Float)
    purchase_date = Column(DateTime(timezone=True), nullable=False)
    purchase_price = Column(DECIMAL(10,2), nullable=False)
    status = Column(String(20), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Add check constraint for status
    __table_args__ = (
        CheckConstraint(
            status.in_(['active', 'sold']),
            name='check_ownership_status_values'
        ),
    )

    # Relationships
    user = relationship("User", back_populates="ownership_shares")
    jet = relationship("Jet", back_populates="ownership_shares")

class ContactInfo(Base):
    __tablename__ = "contact_info"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(String(50), nullable=False)
    value = Column(String(255), nullable=False)
    label = Column(String(100))
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<ContactInfo(id={self.id}, type={self.type}, value={self.value})>"

class UserMembership(Base):
    __tablename__ = "user_memberships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    membership_id = Column(UUID(as_uuid=True), ForeignKey("memberships.id"))
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(20), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Add check constraint for status
    __table_args__ = (
        CheckConstraint(
            status.in_(['active', 'expired', 'cancelled']),
            name='check_status_values'
        ),
    )

    # Relationships
    user = relationship("User", back_populates="user_memberships")
    membership = relationship("Membership", back_populates="user_memberships")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    aircraft = relationship("Aircraft", back_populates="category")

class Aircraft(Base):
    __tablename__ = "aircraft"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    description = Column(Text)
    price_per_hour = Column(Float, nullable=False)
    max_passengers = Column(Integer, nullable=False)
    range_km = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    category = relationship("Category", back_populates="aircraft") 