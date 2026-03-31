from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import SessionLocal
from models.schemas import UserCreate, UserResponse,UserLogin, Token
from services.auth_service import create_user

from services.auth_service import create_user, authenticate_user, create_access_token


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
    
    
@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = authenticate_user(db, user.email, user.password)

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": db_user.email
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }