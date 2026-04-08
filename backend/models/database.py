from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from database.connection import Base
from datetime import datetime
from zoneinfo import ZoneInfo  # <-- clave

ECUADOR_TZ = ZoneInfo("America/Guayaquil")


def ecuador_now():
    return datetime.now(ECUADOR_TZ)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    usuario = Column(String, nullable=False)

    created_at = Column(DateTime, default=ecuador_now)
    is_active = Column(Boolean, default=True)
    monitoring_active = Column(Boolean, default=False)


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, nullable=False)
    alert_type = Column(String, nullable=False)

    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)

    timestamp = Column(DateTime, default=ecuador_now)

    user_id = Column(Integer, ForeignKey("users.id"))