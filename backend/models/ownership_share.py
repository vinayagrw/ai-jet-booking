from sqlalchemy import Column, String, UUID, Float, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin
import uuid

class OwnershipShare(Base, TimestampMixin):
    __tablename__ = "ownership_shares"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    jet_id = Column(UUID(as_uuid=True), ForeignKey('jets.id'))
    share_fraction = Column(Float)
    purchase_date = Column(DateTime(timezone=True), nullable=False)
    purchase_price = Column(Numeric(10, 2), nullable=False)
    status = Column(String(20), nullable=False)

    # Relationships
    user = relationship("User", back_populates="ownership_shares")
    jet = relationship("Jet", back_populates="ownership_shares") 