from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


from database.connection import SessionLocal
from services.auth_service import decode_token, get_user_by_email

security = HTTPBearer()
from models.schemas import UserCreate, UserResponse,UserLogin, Token
from services.auth_service import create_user

from services.auth_service import create_user, authenticate_user, create_access_token
from utils.logger import get_logger


router = APIRouter(prefix="/auth", tags=["auth"])

logger = get_logger("auth")
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
        new_user = create_user(db, user.email, user.password, user.usuario)
        return new_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = authenticate_user(db, user.email, user.password)
    logger.info(f"Login attempt: {user.email}")

    if not db_user:
        logger.warning(f"Credenciales Invalidas: {user.email}")
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    token = create_access_token({
        "sub": db_user.email
    })
    
    logger.info(f"Login success: {user.email}")

    return {
        "access_token": token,
        "token_type": "bearer"
    }
    

# ==============================
# GET CURRENT USER (JWT)
# ==============================
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    logger.info("Decoding token...")

    token = credentials.credentials
    email = decode_token(token)

    print("EMAIL:", email)  # 👈 DEBUG

    if email is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = get_user_by_email(db, email)

    logger.info(f"Token valid for email: {email}")

    if user is None:
        
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user



@router.get("/me", response_model=UserResponse)
def get_me(current_user = Depends(get_current_user)):
    return current_user