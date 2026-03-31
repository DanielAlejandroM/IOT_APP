from fastapi import FastAPI

from database.connection import engine, Base
from models import database  # 🔥 CRÍTICO

from routes import auth

app = FastAPI()

# 🔥 esto crea la tabla
Base.metadata.create_all(bind=engine)

app.include_router(auth.router)

@app.get("/health")
def health():
    return {"status": "ok"}



# @app.post("/analyze")
# def analyze():
#     return {"status": "ok"}

# @app.post("/embedding")
# def embedding():
#     return {"status": "ok"}

# @app.post("/alerts")
# def alerts():
#     return {"status": "ok"}

# @app.get("/alerts/nearby")
# def nearby_alerts():
#     return {"status": "ok"}

# @app.post("/alerts/{id}/respond")
# def respond_alert(id: int):
#     return {"status": "ok"}