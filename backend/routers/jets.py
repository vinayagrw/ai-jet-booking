from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from datetime import datetime
import logging # Import the logging module
from decimal import Decimal

from .. import schemas, models
from ..database import get_db
from .auth import get_current_active_user, get_current_admin_user # Import for protected routes

# Configure logger for this module
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/jets",
    tags=["Jets"],
    responses={
        404: {"description": "Jet not found"}
    },
)

@router.get("/search", response_model=List[schemas.Jet], summary="Search for jets with filters")
def search_jets(
    category: Optional[str] = Query(None, description="Filter by jet category"),
    min_price: Optional[float] = Query(None, description="Minimum price per hour"),
    max_price: Optional[float] = Query(None, description="Maximum price per hour"),
    location: Optional[str] = Query(None, description="Filter by location"),
    passengers: Optional[int] = Query(None, description="Minimum number of passengers"),
    range: Optional[int] = Query(None, description="Minimum range in nautical miles"),
    db: Session = Depends(get_db)
):
    """Search for jets based on various filters.

    Args:
        category (Optional[str]): Filter by jet category
        min_price (Optional[float]): Minimum price per hour
        max_price (Optional[float]): Maximum price per hour
        location (Optional[str]): Filter by location
        passengers (Optional[int]): Minimum number of passengers
        range (Optional[int]): Minimum range in nautical miles
        db (Session): Database session dependency

    Returns:
        List[schemas.Jet]: A list of jets matching the search criteria
    """
    logger.info(f"Searching for jets with filters: category={category}, min_price={min_price}, max_price={max_price}, location={location}, passengers={passengers}, range={range}")
    
    query = db.query(models.Jet).filter(models.Jet.status == "available")

    if category:
        query = query.join(models.JetCategory).filter(models.JetCategory.name.ilike(f"%{category}%"))
    
    if min_price is not None:
        query = query.filter(models.Jet.price_per_hour >= Decimal(str(min_price)))
    
    if max_price is not None:
        query = query.filter(models.Jet.price_per_hour <= Decimal(str(max_price)))
    
    if location:
        query = query.filter(models.Jet.location.ilike(f"%{location}%"))
    
    if passengers is not None:
        query = query.filter(models.Jet.max_passengers >= passengers)
    
    if range is not None:
        query = query.filter(models.Jet.range_nm >= range)

    jets = query.all()
    logger.info(f"Found {len(jets)} jets matching the search criteria")
    return jets

@router.get("/", response_model=List[schemas.Jet], summary="Get all jets")
def get_all_jets(db: Session = Depends(get_db)):
    """Get all available jets."""
    logger.info("Fetching all jets")
    jets = db.query(models.Jet).filter(models.Jet.status == "available").all()
    logger.info(f"Found {len(jets)} jets")
    return jets

@router.get("/categories", response_model=List[schemas.JetCategory], summary="Get all jet categories")
def get_categories(db: Session = Depends(get_db)):
    """Retrieve all available jet categories."""
    logger.info("Fetching all jet categories")
    categories = db.query(models.JetCategory).all()
    logger.info(f"Found {len(categories)} categories")
    return categories

@router.get("/{jet_id}", response_model=schemas.Jet, summary="Get details of a specific jet")
def get_jet_details(jet_id: UUID, db: Session = Depends(get_db)):
    """Retrieve details of a specific private jet by its ID.

    Args:
        jet_id (UUID): The unique identifier of the jet.
        db (Session): Database session dependency.

    Raises:
        HTTPException: 404 if the jet is not found.

    Returns:
        schemas.Jet: The jet object.
    """
    logger.info(f"Attempting to retrieve jet details for ID: {jet_id}")
    jet = db.query(models.Jet).filter(models.Jet.id == jet_id).first()
    if not jet:
        logger.warning(f"Jet with ID {jet_id} not found.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Jet not found")
    logger.info(f"Successfully retrieved jet details for ID: {jet_id}")
    return jet 