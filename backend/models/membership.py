from sqlalchemy import Column, String, UUID, Integer, Numeric, ARRAY
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin
import uuid

class Membership(Base, TimestampMixin):
    __tablename__ = "memberships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(String)
    price = Column(Numeric(10, 2))
    duration_months = Column(Integer)
    benefits = Column(ARRAY(String))
    image_url = Column(String(255))

    # Relationships
    users = relationship("User", back_populates="membership")
    user_memberships = relationship("UserMembership", back_populates="membership") 