from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, text

from database.connection import SessionLocal
from models.schemas import AlertCreate, AlertResponse
from models.database import Alert                        # ← agregar esto
from services.alert_service import create_alert
from routes.auth import get_current_user
from utils.logger import get_logger
from models.database import Alert, User

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


@router.get("/nearby")
def get_nearby_alerts(
    lat: float = Query(...),
    lng: float = Query(...),
    radio: int = Query(default=1000, ge=100, le=50000),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    sql = text("""
        SELECT 
            a.id, a.event_type, a.alert_type, a.lat, a.lng, a.timestamp, a.user_id,
            u.usuario, u.email
        FROM alerts a
        JOIN users u ON a.user_id = u.id
        WHERE ST_DWithin(
            ST_MakePoint(a.lng, a.lat)::geography,
            ST_MakePoint(:lng, :lat)::geography,
            :radio
        )
        ORDER BY a.timestamp DESC
    """)

    resultado = db.execute(sql, {"lat": lat, "lng": lng, "radio": radio}).fetchall()

    return {
        "total": len(resultado),
        "radio_metros": radio,
        "resultados": [
            {
                "id": row.id,
                "event_type": row.event_type,
                "alert_type": row.alert_type,
                "lat": row.lat,
                "lng": row.lng,
                "timestamp": row.timestamp,
                "usuario": {
                    "id": row.user_id,
                    "nombre": row.usuario,
                    "email": row.email
                }
            }
            for row in resultado
        ]
    }
@router.get("")
def get_all_alerts(
    pagina: int = Query(default=1, ge=1),
    todo: bool = Query(default=False),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    total = db.query(Alert).count()

    if todo:
        alerts = db.query(Alert, User).join(User, Alert.user_id == User.id).order_by(Alert.timestamp.desc()).all()
        paginas = 1
        pagina_actual = 1
    else:
        limite = 10
        offset = (pagina - 1) * limite
        alerts = db.query(Alert, User).join(User, Alert.user_id == User.id).order_by(Alert.timestamp.desc()).offset(offset).limit(limite).all()
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
                "usuario": {
                    "id": u.id,
                    "nombre": u.usuario,
                    "email": u.email
                }
            }
            for a, u in alerts
        ]
    }
    
