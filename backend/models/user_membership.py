from sqlalchemy import Column, String, UUID, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin
import uuid

class UserMembership(Base, TimestampMixin):
    __tablename__ = "user_memberships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    membership_id = Column(UUID(as_uuid=True), ForeignKey('memberships.id'))
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(20), nullable=False)

    # Relationships
    user = relationship("User", back_populates="user_memberships")
    membership = relationship("Membership", back_populates="user_memberships") 