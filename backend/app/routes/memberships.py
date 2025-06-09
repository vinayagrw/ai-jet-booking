from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Membership
from ..schemas.membership import MembershipResponse

router = APIRouter()

@router.get("/memberships", response_model=List[MembershipResponse])
def get_memberships(db: Session = Depends(get_db)):
    memberships = db.query(Membership).all()
    return memberships

@router.get("/memberships/{membership_id}", response_model=MembershipResponse)
def get_membership(membership_id: str, db: Session = Depends(get_db)):
    membership = db.query(Membership).filter(Membership.id == membership_id).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")
    return membership 