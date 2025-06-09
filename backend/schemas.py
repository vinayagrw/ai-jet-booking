from pydantic import BaseModel, EmailStr, UUID4, Field, validator
from typing import Optional, List, Union
from datetime import datetime
from decimal import Decimal
from uuid import UUID
import logging

# Configure logger for this module
logger = logging.getLogger(__name__)

# Base schemas
class UserBase(BaseModel):
    email: str
    name: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    profile_image_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None

    @validator('role')
    def validate_role(cls, v):
        if v is not None and v not in ['user', 'admin']:
            raise ValueError('role must be one of: user, admin')
        return v

class User(UserBase):
    id: UUID
    role: str
    membership_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class JetCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class JetCategoryCreate(JetCategoryBase):
    pass

class JetCategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None

class JetCategoryInDB(JetCategoryBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class JetCategory(JetCategoryInDB):
    pass

class MembershipBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Optional[Decimal] = None
    duration_months: Optional[int] = None
    benefits: Optional[List[str]] = None
    image_url: Optional[str] = None

class MembershipCreate(MembershipBase):
    pass

class MembershipUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    duration_months: Optional[int] = None
    benefits: Optional[List[str]] = None
    image_url: Optional[str] = None

class MembershipInDB(MembershipBase):
    id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True

class Membership(MembershipInDB):
    pass

class JetBase(BaseModel):
    name: str
    manufacturer: str
    category_id: Optional[UUID] = None
    year: Optional[int] = None
    max_speed_mph: Optional[int] = None
    max_passengers: Optional[int] = None
    price_per_hour: Optional[float] = None
    cabin_height_ft: Optional[float] = None
    cabin_width_ft: Optional[float] = None
    cabin_length_ft: Optional[float] = None
    baggage_capacity_cuft: Optional[int] = None
    takeoff_distance_ft: Optional[int] = None
    landing_distance_ft: Optional[int] = None
    fuel_capacity_lbs: Optional[int] = None
    image_url: Optional[str] = None
    gallery_urls: Optional[List[str]] = None
    features: Optional[List[str]] = None
    amenities: Optional[List[str]] = None
    status: str = "available"
    range_nm: int

class JetCreate(JetBase):
    pass

class Jet(JetBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class JetUpdate(BaseModel):
    name: Optional[str] = None
    manufacturer: Optional[str] = None
    category_id: Optional[UUID] = None
    year: Optional[int] = None
    max_speed_mph: Optional[int] = None
    max_passengers: Optional[int] = None
    price_per_hour: Optional[float] = None
    cabin_height_ft: Optional[float] = None
    cabin_width_ft: Optional[float] = None
    cabin_length_ft: Optional[float] = None
    baggage_capacity_cuft: Optional[int] = None
    takeoff_distance_ft: Optional[int] = None
    landing_distance_ft: Optional[int] = None
    fuel_capacity_lbs: Optional[int] = None
    image_url: Optional[str] = None
    gallery_urls: Optional[List[str]] = None
    features: Optional[List[str]] = None
    amenities: Optional[List[str]] = None
    status: Optional[str] = None
    range_nm: Optional[int] = None

class BookingBase(BaseModel):
    jet_id: UUID
    origin: str
    destination: str
    start_time: datetime
    end_time: datetime
    passengers: int = 1
    special_requests: Optional[str] = None

    @validator('end_time')
    def end_time_must_be_after_start_time(cls, v, values):
        if 'start_time' in values and v <= values['start_time']:
            raise ValueError('end_time must be after start_time')
        return v

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: UUID
    user_id: UUID
    status: str = "pending"
    total_price: Optional[Decimal] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

    def __init__(self, **data):
        try:
            logger.info(f"Initializing Booking with data: {data}")
            super().__init__(**data)
        except Exception as e:
            logger.error(f"Error initializing Booking: {str(e)}")
            logger.error(f"Data that caused the error: {data}")
            raise

class BookingUpdate(BaseModel):
    origin: Optional[str] = None
    destination: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    passengers: Optional[int] = None
    special_requests: Optional[str] = None
    status: Optional[str] = None
    total_price: Optional[Decimal] = None

class OwnershipShareBase(BaseModel):
    user_id: UUID4
    jet_id: UUID4
    share_fraction: float
    purchase_date: datetime
    purchase_price: Decimal
    status: str

    @validator('status')
    def validate_status(cls, v):
        if v not in ['active', 'sold']:
            raise ValueError('status must be one of: active, sold')
        return v

class OwnershipShareCreate(OwnershipShareBase):
    pass

class OwnershipShareUpdate(BaseModel):
    share_fraction: Optional[float] = None
    purchase_date: Optional[datetime] = None
    purchase_price: Optional[Decimal] = None
    status: Optional[str] = None

    @validator('status')
    def validate_status(cls, v):
        if v is not None and v not in ['active', 'sold']:
            raise ValueError('status must be one of: active, sold')
        return v

class OwnershipShareInDB(OwnershipShareBase):
    id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True

class OwnershipShare(OwnershipShareInDB):
    pass

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AircraftBase(BaseModel):
    name: str
    category_id: int
    description: Optional[str] = None
    price_per_hour: float
    max_passengers: int
    range_km: int

class AircraftCreate(AircraftBase):
    pass

class AircraftResponse(AircraftBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: CategoryResponse

    class Config:
        from_attributes = True

class ContactInfoBase(BaseModel):
    type: str
    value: str
    label: Optional[str] = None
    is_primary: bool = False

class ContactInfoCreate(ContactInfoBase):
    pass

class ContactInfoUpdate(BaseModel):
    type: Optional[str] = None
    value: Optional[str] = None
    label: Optional[str] = None
    is_primary: Optional[bool] = None

class ContactInfo(ContactInfoBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserMembershipBase(BaseModel):
    user_id: UUID
    membership_id: UUID
    start_date: datetime
    end_date: datetime
    status: str

    @validator('status')
    def validate_status(cls, v):
        if v not in ['active', 'expired', 'cancelled']:
            raise ValueError('status must be one of: active, expired, cancelled')
        return v

class UserMembershipCreate(UserMembershipBase):
    pass

class UserMembershipUpdate(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None

    @validator('status')
    def validate_status(cls, v):
        if v is not None and v not in ['active', 'expired', 'cancelled']:
            raise ValueError('status must be one of: active, expired, cancelled')
        return v

class UserMembership(UserMembershipBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True 