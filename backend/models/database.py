from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from database.connection import Base
from datetime import datetime


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
    usuario = Column(String, nullable=False)

    # ==============================
    # (OPCIONAL MVP+)
    # ==============================
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, nullable=False)
    alert_type = Column(String, nullable=False)

    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)

    timestamp = Column(DateTime, default=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id"))