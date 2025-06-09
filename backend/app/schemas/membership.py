from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class MembershipResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    price: float
    duration_months: int
    benefits: List[str]
    image_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True 