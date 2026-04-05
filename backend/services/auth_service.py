from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models.database import User

from datetime import datetime, timedelta
from jose import jwt, JWTError
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

from utils.logger import get_logger
logger = get_logger("auth_service")

from models.database import User
from config import SECRET_KEY, ALGORITHM       


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def create_user(db: Session, email: str, password: str, usuario:str):

    # 🔴 validar duplicado
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise Exception("Usario ya registrado con ese email")

    # 🔐 hash
    hashed_password = hash_password(password)

    user = User(
        email=email,
        password_hash=hashed_password,
        usuario=usuario
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            return None

        return email

    except JWTError:
        return None

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            return None

        return email

    except JWTError:
        return None
    

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            return None

        return email

    except JWTError:
        return None
    

logger = get_logger("auth_service")