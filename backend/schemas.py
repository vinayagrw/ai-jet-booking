from pydantic import BaseModel, EmailStr, UUID4, Field, validator
from typing import Optional, List, Union
from datetime import datetime
from decimal import Decimal
from uuid import UUID

# Base schemas
class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    profile_image_url: Optional[str] = None
    membership_id: Optional[UUID4] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    profile_image_url: Optional[str] = None
    membership_id: Optional[UUID4] = None

class User(UserBase):
    id: UUID
    role: str
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
    category_id: UUID4
    year: Optional[int] = None
    max_speed_mph: Optional[int] = None
    max_passengers: Optional[int] = None
    price_per_hour: Optional[Decimal] = None
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
    range_nm: int
    location: Optional[str] = None

class JetCreate(JetBase):
    pass

class JetUpdate(BaseModel):
    name: Optional[str] = None
    manufacturer: Optional[str] = None
    category_id: Optional[UUID4] = None
    year: Optional[int] = None
    max_speed_mph: Optional[int] = None
    max_passengers: Optional[int] = None
    price_per_hour: Optional[Decimal] = None
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
    location: Optional[str] = None

class JetInDB(JetBase):
    id: UUID4
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Jet(JetInDB):
    pass

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

class ContactInfoInDB(ContactInfoBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ContactInfo(ContactInfoInDB):
    pass

class UserMembershipBase(BaseModel):
    user_id: UUID4
    membership_id: UUID4
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

class UserMembershipInDB(UserMembershipBase):
    id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True

class UserMembership(UserMembershipInDB):
    pass

class BookingBase(BaseModel):
    origin: str
    destination: str
    start_time: datetime
    end_time: datetime
    passengers: int = 1
    special_requests: Optional[str] = None

class BookingCreate(BookingBase):
    jet_id: UUID

class Booking(BookingBase):
    id: UUID
    user_id: UUID
    jet_id: UUID
    status: str
    total_price: Optional[Decimal] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

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
    user: User

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