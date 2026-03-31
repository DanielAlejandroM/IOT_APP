from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import SessionLocal
from models.schemas import UserCreate, UserResponse
from services.auth_service import create_user

router = APIRouter(prefix="/auth", tags=["auth"])

# dependencia DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        new_user = create_user(db, user.email, user.password)
        return new_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))