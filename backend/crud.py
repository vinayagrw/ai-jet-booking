from sqlalchemy.orm import Session
from . import models, schemas
from .logger import db_logger
from typing import List, Optional
import uuid

def get_jet_categories(db: Session) -> List[models.JetCategory]:
    db_logger.info("Fetching all jet categories")
    return db.query(models.JetCategory).all()

def get_jets(db: Session) -> List[models.Jet]:
    db_logger.info("Fetching all jets")
    return db.query(models.Jet).all()

def get_jet(db: Session, jet_id: str) -> Optional[models.Jet]:
    db_logger.info(f"Fetching jet with ID: {jet_id}")
    try:
        return db.query(models.Jet).filter(models.Jet.id == jet_id).first()
    except Exception as e:
        db_logger.error(f"Error fetching jet {jet_id}: {str(e)}")
        raise

def create_booking(db: Session, booking: schemas.BookingCreate) -> models.Booking:
    db_logger.info(f"Creating new booking for jet ID: {booking.jet_id}")
    try:
        db_booking = models.Booking(
            user_id=booking.user_id,
            jet_id=booking.jet_id,
            origin=booking.origin,
            destination=booking.destination,
            start_time=booking.start_time,
            end_time=booking.end_time,
            total_amount=booking.total_amount,
            status=booking.status,
            passengers=booking.passengers,
            special_requests=booking.special_requests,
            total_price=booking.total_price
        )
        db.add(db_booking)
        db.commit()
        db.refresh(db_booking)
        db_logger.info(f"Successfully created booking with ID: {db_booking.id}")
        return db_booking
    except Exception as e:
        db_logger.error(f"Error creating booking: {str(e)}")
        db.rollback()
        raise

def get_bookings(db: Session) -> List[models.Booking]:
    db_logger.info("Fetching all bookings")
    return db.query(models.Booking).all()

def get_booking(db: Session, booking_id: str) -> Optional[models.Booking]:
    db_logger.info(f"Fetching booking with ID: {booking_id}")
    try:
        return db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    except Exception as e:
        db_logger.error(f"Error fetching booking {booking_id}: {str(e)}")
        raise

def get_memberships(db: Session) -> List[models.Membership]:
    db_logger.info("Fetching all memberships")
    return db.query(models.Membership).all()

def get_membership(db: Session, membership_id: str) -> Optional[models.Membership]:
    db_logger.info(f"Fetching membership with ID: {membership_id}")
    try:
        return db.query(models.Membership).filter(models.Membership.id == membership_id).first()
    except Exception as e:
        db_logger.error(f"Error fetching membership {membership_id}: {str(e)}")
        raise

# Contact Info functions
def get_contact_info(db: Session) -> List[models.ContactInfo]:
    db_logger.info("Fetching all contact information")
    return db.query(models.ContactInfo).all()

def get_contact_info_by_id(db: Session, contact_id: str) -> Optional[models.ContactInfo]:
    db_logger.info(f"Fetching contact information with ID: {contact_id}")
    try:
        return db.query(models.ContactInfo).filter(models.ContactInfo.id == contact_id).first()
    except Exception as e:
        db_logger.error(f"Error fetching contact info {contact_id}: {str(e)}")
        raise

def create_contact_info(db: Session, contact_info: schemas.ContactInfoCreate) -> models.ContactInfo:
    db_logger.info("Creating new contact information")
    try:
        db_contact_info = models.ContactInfo(
            type=contact_info.type,
            value=contact_info.value,
            label=contact_info.label,
            is_primary=contact_info.is_primary
        )
        db.add(db_contact_info)
        db.commit()
        db.refresh(db_contact_info)
        db_logger.info(f"Successfully created contact info with ID: {db_contact_info.id}")
        return db_contact_info
    except Exception as e:
        db_logger.error(f"Error creating contact info: {str(e)}")
        db.rollback()
        raise

def get_primary_contact_info(db: Session) -> List[models.ContactInfo]:
    db_logger.info("Fetching primary contact information")
    try:
        # Check if we have any contact info
        contact_info = db.query(models.ContactInfo).filter(models.ContactInfo.is_primary == True).all()
        
        # If no contact info exists, create some test data
        if not contact_info:
            db_logger.info("No contact info found, creating test data")
            test_data = [
                models.ContactInfo(
                    type="email",
                    value="contact@aijetbooking.com",
                    label="Main Email",
                    is_primary=True
                ),
                models.ContactInfo(
                    type="phone",
                    value="+1 (555) 123-4567",
                    label="Customer Support",
                    is_primary=True
                ),
                models.ContactInfo(
                    type="address",
                    value="123 Aviation Way, Suite 100",
                    label="Headquarters",
                    is_primary=True
                )
            ]
            
            for item in test_data:
                db.add(item)
            
            db.commit()
            contact_info = test_data
            
        return contact_info
    except Exception as e:
        db_logger.error(f"Error fetching primary contact info: {str(e)}")
        raise 