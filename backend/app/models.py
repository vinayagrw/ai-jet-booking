from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON, Boolean, Table, ARRAY, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import uuid

class JetCategory(Base):
    __tablename__ = "jet_categories"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(String)
    image_url = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    jets = relationship("Jet", back_populates="category")

class Membership(Base):
    __tablename__ = "memberships"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(String)
    price = Column(Float)
    duration_months = Column(Integer)
    benefits = Column(ARRAY(String))
    image_url = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    users = relationship("User", secondary="user_memberships", back_populates="memberships")

class User(Base):
    __tablename__ = "users"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    name = Column(String(100))
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default='user')
    first_name = Column(String(100))
    last_name = Column(String(100))
    phone = Column(String(20))
    profile_image_url = Column(String(255))
    membership_id = Column(UUID, ForeignKey('memberships.id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    memberships = relationship("Membership", secondary="user_memberships", back_populates="users")
    bookings = relationship("Booking", back_populates="user")
    ownership_shares = relationship("OwnershipShare", back_populates="user")

class Jet(Base):
    __tablename__ = "jets"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    manufacturer = Column(String(100), nullable=False)
    category_id = Column(UUID, ForeignKey('jet_categories.id'))
    year = Column(Integer)
    max_speed_mph = Column(Integer)
    max_passengers = Column(Integer)
    price_per_hour = Column(Float)
    cabin_height_ft = Column(Float)
    cabin_width_ft = Column(Float)
    cabin_length_ft = Column(Float)
    baggage_capacity_cuft = Column(Integer)
    takeoff_distance_ft = Column(Integer)
    landing_distance_ft = Column(Integer)
    fuel_capacity_lbs = Column(Integer)
    image_url = Column(String(255))
    gallery_urls = Column(ARRAY(String))
    features = Column(ARRAY(String))
    amenities = Column(ARRAY(String))
    status = Column(String(50), nullable=False, default='available')
    range_nm = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    category = relationship("JetCategory", back_populates="jets")
    bookings = relationship("Booking", back_populates="jet")
    ownership_shares = relationship("OwnershipShare", back_populates="jet")

class ContactInfo(Base):
    __tablename__ = "contact_info"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    type = Column(String(50), nullable=False)
    value = Column(String(255), nullable=False)
    label = Column(String(100))
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class UserMembership(Base):
    __tablename__ = "user_memberships"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID, ForeignKey('users.id'))
    membership_id = Column(UUID, ForeignKey('memberships.id'))
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(20), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID, ForeignKey('users.id'))
    jet_id = Column(UUID, ForeignKey('jets.id'))
    origin = Column(String(255), nullable=False)
    destination = Column(String(255), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(20), nullable=False, default='pending')
    passengers = Column(Integer, nullable=False, default=1)
    special_requests = Column(String)
    total_price = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="bookings")
    jet = relationship("Jet", back_populates="bookings")

class OwnershipShare(Base):
    __tablename__ = "ownership_shares"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID, ForeignKey('users.id'))
    jet_id = Column(UUID, ForeignKey('jets.id'))
    share_fraction = Column(Float)
    purchase_date = Column(DateTime(timezone=True), nullable=False)
    purchase_price = Column(Float, nullable=False)
    status = Column(String(20), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="ownership_shares")
    jet = relationship("Jet", back_populates="ownership_shares") 