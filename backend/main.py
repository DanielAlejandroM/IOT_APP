from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/auth/register")
def register():
    return {"status": "ok"}

@app.post("/auth/login")
def login():
    return {"status": "ok"}

@app.post("/analyze")
def analyze():
    return {"status": "ok"}

@app.post("/embedding")
def embedding():
    return {"status": "ok"}

@app.post("/alerts")
def alerts():
    return {"status": "ok"}

@app.get("/alerts/nearby")
def nearby_alerts():
    return {"status": "ok"}

@app.post("/alerts/{id}/respond")
def respond_alert(id: int):
    return {"status": "ok"}