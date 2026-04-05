from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database.connection import SessionLocal
from models.schemas import AlertCreate, AlertResponse
from models.database import Alert                        # ← agregar esto
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
        alert_type=alert.alert_type,
        lat=alert.lat,
        lng=alert.lng,
        user_id=current_user.id
    )

    return new_alert

@router.get("")
def get_all_alerts(
    pagina: int = Query(default=1, ge=1),
    todo: bool = Query(default=False),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    total = db.query(Alert).count()
    logger.info(f"User {current_user.email} retrieving alerts")

    if todo:
        alerts = db.query(Alert).order_by(Alert.timestamp.desc()).all()
        paginas = 1
        pagina_actual = 1
    else:
        limite = 5
        offset = (pagina - 1) * limite
        alerts = db.query(Alert).order_by(Alert.timestamp.desc()).offset(offset).limit(limite).all()
        paginas = (total + limite - 1) // limite
        pagina_actual = pagina

    return {
        "pagina": pagina_actual,
        "total": total,
        "paginas": paginas,
        "resultados": [
            {
                "id": a.id,
                "event_type": a.event_type,
                "alert_type": a.alert_type,
                "lat": a.lat,
                "lng": a.lng,
                "timestamp": a.timestamp,
                "user_id": a.user_id
            }
            for a in alerts
        ]
    }