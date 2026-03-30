from sqlalchemy import Column, Integer, String
from database.connection import Base


class User(Base):
    __tablename__ = "users"

    # ==============================
    # PRIMARY KEY
    # ==============================
    id = Column(Integer, primary_key=True, index=True)

    # ==============================
    # USER DATA
    # ==============================
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)

    # ==============================
    # (OPCIONAL MVP+)
    # ==============================
    # created_at = Column(DateTime, default=datetime.utcnow)
    # is_active = Column(Boolean, default=True)