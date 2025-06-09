from sqlalchemy.orm import Session
from .models import JetCategory
import uuid

def init_jet_categories(db: Session):
    """Initialize jet categories if they don't exist."""
    categories = [
        {
            "name": "Light Jet",
            "description": "Small, efficient jets perfect for short trips with up to 8 passengers.",
            "image_url": "/images/categories/light-jet.jpg"
        },
        {
            "name": "Midsize Jet",
            "description": "Versatile jets offering a balance of range, speed, and comfort for 8-10 passengers.",
            "image_url": "/images/categories/midsize-jet.jpg"
        },
        {
            "name": "Heavy Jet",
            "description": "Large, powerful jets with extended range and luxury amenities for 10-16 passengers.",
            "image_url": "/images/categories/heavy-jet.jpg"
        },
        {
            "name": "Ultra Long Range Jet",
            "description": "Premium jets with exceptional range and luxury features for long-haul flights.",
            "image_url": "/images/categories/ultra-long-range-jet.jpg"
        }
    ]

    for category_data in categories:
        # Check if category already exists
        existing = db.query(JetCategory).filter(JetCategory.name == category_data["name"]).first()
        if not existing:
            category = JetCategory(
                id=uuid.uuid4(),
                **category_data
            )
            db.add(category)
    
    db.commit() 