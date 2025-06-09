from sqlalchemy import Column, String, UUID, Integer, Numeric, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin
import uuid

class Booking(Base, TimestampMixin):
    __tablename__ = "bookings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    jet_id = Column(UUID(as_uuid=True), ForeignKey('jets.id'))
    origin = Column(String(255), nullable=False)
    destination = Column(String(255), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(20), nullable=False, default='pending')
    passengers = Column(Integer, nullable=False, default=1)
    special_requests = Column(Text)
    total_price = Column(Numeric(10, 2))

    # Relationships
    user = relationship("User", back_populates="bookings")
    jet = relationship("Jet", back_populates="bookings") 