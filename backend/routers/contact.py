from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from backend.database import get_db

router = APIRouter(prefix="/contact", tags=["Contact"])

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    message: str

class ContactInfo(BaseModel):
    email: str
    phone: str
    address: str
    business_hours: str

@router.get("/primary", response_model=ContactInfo)
def get_primary_contact_info():
    """Get primary contact information for the business."""
    return {
        "email": "contact@aijetbooking.com",
        "phone": "+1 (555) 123-4567",
        "address": "123 Aviation Way, Suite 100, New York, NY 10001",
        "business_hours": "Monday - Friday: 9:00 AM - 6:00 PM EST"
    }

@router.post("/", status_code=status.HTTP_201_CREATED)
def submit_contact_form(contact: ContactMessage, db: Session = Depends(get_db)):
    # Here you would typically save the message to the database or send an email
    # For now, just return a success message
    # Example: db.add(ContactModel(**contact.dict())); db.commit()
    return {"message": "Thank you for contacting us! We will get back to you soon."} 