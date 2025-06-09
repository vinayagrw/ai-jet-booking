from sqlalchemy import Column, String, UUID, Boolean
from .base import Base, TimestampMixin
import uuid

class ContactInfo(Base, TimestampMixin):
    __tablename__ = "contact_info"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(String(50), nullable=False)
    value = Column(String(255), nullable=False)
    label = Column(String(100))
    is_primary = Column(Boolean, default=False) 