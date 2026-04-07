from sqlalchemy.orm import Session
from models.database import Alert
from utils.logger import get_logger

logger = get_logger("alert_service")


def create_alert(db: Session, event_type: str, alert_type: str, lat: float, lng: float, user_id: int):

    logger.info(f"Creating alert: {event_type} at ({lat}, {lng})")

    alert = Alert(
        event_type=event_type,
        alert_type=alert_type,
        lat=lat,
        lng=lng,
        user_id=user_id
    )

    db.add(alert)
    db.commit()
    db.refresh(alert)

    logger.info(f"Alert created with ID: {alert.id}")

    return alert