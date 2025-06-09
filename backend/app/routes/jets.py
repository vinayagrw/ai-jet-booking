from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Jet
from ..schemas.jet import JetResponse, JetSearchParams

router = APIRouter()

@router.get("/jets", response_model=List[JetResponse])
def get_jets(db: Session = Depends(get_db)):
    jets = db.query(Jet).all()
    return jets

@router.get("/jets/{jet_id}", response_model=JetResponse)
def get_jet(jet_id: str, db: Session = Depends(get_db)):
    jet = db.query(Jet).filter(Jet.id == jet_id).first()
    if not jet:
        raise HTTPException(status_code=404, detail="Jet not found")
    return jet

@router.get("/jets/search", response_model=List[JetResponse])
def search_jets(
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    location: Optional[str] = None,
    passengers: Optional[int] = None,
    range: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Jet)
    
    if category:
        query = query.filter(Jet.category_id == category)
    if min_price:
        query = query.filter(Jet.price_per_hour >= min_price)
    if max_price:
        query = query.filter(Jet.price_per_hour <= max_price)
    if passengers:
        query = query.filter(Jet.max_passengers >= passengers)
    if range:
        query = query.filter(Jet.range_nm >= range)
    
    jets = query.all()
    return jets 