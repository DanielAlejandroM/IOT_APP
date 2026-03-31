from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models.database import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def create_user(db: Session, email: str, password: str):

    # 🔴 validar duplicado
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise Exception("Usario ya registrado con ese email")

    # 🔐 hash
    hashed_password = hash_password(password)

    user = User(
        email=email,
        password_hash=hashed_password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user