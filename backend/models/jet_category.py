from sqlalchemy import Column, String, UUID
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin
import uuid

class JetCategory(Base, TimestampMixin):
    __tablename__ = "jet_categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(String)
    image_url = Column(String(255))

    # Relationships
    jets = relationship("Jet", back_populates="category") 