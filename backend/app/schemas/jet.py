from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class JetResponse(BaseModel):
    id: UUID
    name: str
    manufacturer: str
    category_id: UUID
    year: Optional[int]
    max_speed_mph: Optional[int]
    max_passengers: int
    price_per_hour: float
    cabin_height_ft: Optional[float]
    cabin_width_ft: Optional[float]
    cabin_length_ft: Optional[float]
    baggage_capacity_cuft: Optional[int]
    takeoff_distance_ft: Optional[int]
    landing_distance_ft: Optional[int]
    fuel_capacity_lbs: Optional[int]
    image_url: Optional[str]
    gallery_urls: Optional[List[str]]
    features: Optional[List[str]]
    amenities: Optional[List[str]]
    status: str
    range_nm: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class JetSearchParams(BaseModel):
    category: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    location: Optional[str] = None
    passengers: Optional[int] = None
    range: Optional[int] = None 