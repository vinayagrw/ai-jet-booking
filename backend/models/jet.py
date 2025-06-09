from sqlalchemy import Column, String, UUID, Integer, Numeric, ARRAY, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin
import uuid

class Jet(Base, TimestampMixin):
    __tablename__ = "jets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    manufacturer = Column(String(100), nullable=False)
    category_id = Column(UUID(as_uuid=True), ForeignKey('jet_categories.id'))
    year = Column(Integer)
    max_speed_mph = Column(Integer)
    max_passengers = Column(Integer)
    price_per_hour = Column(Numeric(10, 2))
    cabin_height_ft = Column(Numeric(4, 1))
    cabin_width_ft = Column(Numeric(4, 1))
    cabin_length_ft = Column(Numeric(4, 1))
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

    # Relationships
    category = relationship("JetCategory", back_populates="jets")
    bookings = relationship("Booking", back_populates="jet")
    ownership_shares = relationship("OwnershipShare", back_populates="jet") 