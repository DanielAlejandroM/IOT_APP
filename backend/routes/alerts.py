from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.connection import SessionLocal
from models.schemas import AlertCreate, AlertResponse
from services.alert_service import create_alert
from routes.auth import get_current_user
from utils.logger import get_logger

router = APIRouter(prefix="/alerts", tags=["alerts"])
logger = get_logger("alerts")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("", response_model=AlertResponse)
def create_alert_endpoint(
    alert: AlertCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    logger.info(f"User {current_user.email} creating alert")

    new_alert = create_alert(
        db=db,
        event_type=alert.event_type,
        lat=alert.lat,
        lng=alert.lng,
        user_id=current_user.id
    )

    return new_alert