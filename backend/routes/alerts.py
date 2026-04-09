from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, text

from database.connection import SessionLocal
from models.schemas import AlertCreate, AlertResponse
from models.database import Alert, User
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


@router.get("/nearby")
def get_nearby_alerts(
    lat: float = Query(...),
    lng: float = Query(...),
    radio: int = Query(default=1000, ge=100, le=50000),
    pagina: int = Query(default=1, ge=1),
    limite: int = Query(default=10, ge=1, le=100),
    todo: bool = Query(default=False),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Primero contamos el total sin paginar
    count_sql = text("""
        SELECT COUNT(*) 
        FROM alerts a
        WHERE ST_DWithin(
            ST_MakePoint(a.lng, a.lat)::geography,
            ST_MakePoint(:lng, :lat)::geography,
            :radio
        )
    """)
    total = db.execute(count_sql, {"lat": lat, "lng": lng, "radio": radio}).scalar()

    if todo:
        offset_val = 0
        limit_val = total if total > 0 else 1  # traer todo
        pagina_actual = 1
        paginas = 1
    else:
        offset_val = (pagina - 1) * limite
        limit_val = limite
        paginas = (total + limite - 1) // limite if total > 0 else 1
        pagina_actual = pagina

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

    resultado = db.execute(sql, {
        "lat": lat,
        "lng": lng,
        "radio": radio,
        "limite": limit_val,
        "offset": offset_val
    }).fetchall()

    return {
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
    limite: int = Query(default=10, ge=1, le=100),
    todo: bool = Query(default=False),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    total = db.query(Alert).count()

    if todo:
        alerts = (
            db.query(Alert, User)
            .join(User, Alert.user_id == User.id)
            .order_by(Alert.timestamp.asc())  # ← ascendente
            .all()
        )
        paginas = 1
        pagina_actual = 1
    else:
        offset = (pagina - 1) * limite
        alerts = (
            db.query(Alert, User)
            .join(User, Alert.user_id == User.id)
            .order_by(Alert.timestamp.asc())  # ← ascendente
            .offset(offset)
            .limit(limite)
            .all()
        )
        paginas = (total + limite - 1) // limite if total > 0 else 1
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


@router.post("/{alert_id}/respond")
def respond_to_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alerta no encontrada")

    if alert.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="No puedes responder tu propia alerta")

    return {
        "mensaje": "Apoyo confirmado",
        "alert_id": alert_id,
        "respondido_por": {
            "id": current_user.id,
            "nombre": current_user.usuario,
            "email": current_user.email
        }
    }