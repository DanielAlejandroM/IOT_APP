# 🚨 Threat Detection API Backend

**Sistema de detección temprana de amenazas basado en análisis de audio/texto y geolocalización**

> Una API robusta para identificar, clasificar y rastrear eventos de riesgo en tiempo real.

![Python](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-lightblue)
![PostGIS](https://img.shields.io/badge/PostGIS-3.4+-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contribución](#contribución)

---

## ✨ Características

### 🔐 Autenticación & Seguridad
- ✅ Registro de usuarios con contraseña hasheada (bcrypt)
- ✅ Autenticación JWT con tokens seguros
- ✅ Control de acceso por usuario
- ✅ CORS configurado para desarrollo

### 🎤 Procesamiento de Audio
- ✅ Recepción de chunks de audio (WAV, MP3, etc)
- ✅ Almacenamiento seguro en servidor
- ✅ Mock STT (Speech-to-Text) integrado
- ✅ Listo para integración con Whisper/Google Speech

### 🧠 Análisis Inteligente
- ✅ Detección de amenazas basada en reglas
- ✅ Clasificación automática (EXTORTION, THREAT, HARASSMENT, FRAUD)
- ✅ Scoring de riesgo (0.0 - 1.0)
- ✅ Extracción de palabras clave
- ✅ Niveles de riesgo: LOW, MEDIUM, HIGH, CRITICAL

### 📊 Embeddings Vectoriales
- ✅ Vectorización de texto con SentenceTransformers
- ✅ Modelo: `all-MiniLM-L6-v2` (384 dimensiones)
- ✅ Búsqueda semántica preparada
- ✅ Mock embeddings para desarrollo

### 📍 Geolocalización Avanzada
- ✅ Almacenamiento de eventos con coordenadas GPS
- ✅ Índices espaciales con PostGIS
- ✅ Búsqueda de eventos cercanos (ST_DWithin)
- ✅ Historial geolocalizad

o por usuario

### 📖 Historial & Auditoría
- ✅ Registro completo de eventos
- ✅ Timestamps automáticos
- ✅ Historial por usuario
- ✅ Trazabilidad de acciones

### 💪 Producción-Ready
- ✅ Dockerizado con docker-compose
- ✅ Migraciones de BD automáticas
- ✅ Health checks integrados
- ✅ Documentación interactiva (Swagger/OpenAPI)
- ✅ Logging estructurado

---

## 🏗️ Arquitectura

### Diagrama de Flujo

```
┌─────────────────────┐
│   Kotlin App        │  ← Captura audio + ubicación
└──────────┬──────────┘
           │ HTTP/JSON
           ↓
┌──────────────────────────────────────┐
│     FastAPI Backend (Python)         │
│                                      │
│  ┌────────────────────────────────┐  │
│  │   Routes (Endpoints)           │  │
│  │ ├─ /auth      → Autenticación  │  │
│  │ ├─ /audio     → Recepción      │  │
│  │ ├─ /transcribe→ STT Mock       │  │
│  │ ├─ /analyze   → Detección      │  │
│  │ ├─ /embedding → Vectorización  │  │
│  │ ├─ /geo       → Ubicaciones    │  │
│  │ ├─ /comments  → Historial      │  │
│  │ └─ /health    → Monitoreo      │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │   Services (Lógica de Negocio) │  │
│  │ ├─ AuthService       (JWT)     │  │
│  │ ├─ STTService        (Audio)   │  │
│  │ ├─ DetectionService  (IA)      │  │
│  │ ├─ EmbeddingService  (Vec)     │  │
│  │ └─ GeoService        (Geo)     │  │
│  └────────────────────────────────┘  │
└──────────┬───────────────────────────┘
           │ SQL/GIS
           ↓
┌──────────────────────────────────────┐
│   PostgreSQL 16 + PostGIS 3.4        │
│                                      │
│  Tables:                             │
│  ├─ users                            │
│  ├─ audio_chunks                     │
│  ├─ transcriptions                   │
│  ├─ embeddings                       │
│  ├─ risk_analysis                    │
│  ├─ geolocations (GEOMETRY POINT)    │
│  └─ comments                         │
└──────────────────────────────────────┘
```

### Stack Tecnológico

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|-----------|
| **Framework** | FastAPI | 0.104+ | API REST |
| **Server** | Uvicorn | 0.24+ | Servidor ASGI |
| **ORM** | SQLAlchemy | 2.0+ | Mapeo de BD |
| **BD Principal** | PostgreSQL | 16+ | Datos relacionales |
| **Extensión Geo** | PostGIS | 3.4+ | Datos geoespaciales |
| **Autenticación** | Python-Jose | 3.3+ | JWT tokens |
| **Hashing** | Passlib + Bcrypt | 1.7+ | Contraseñas seguras |
| **Embeddings** | SentenceTransformers | 2.2+ | Vectorización |
| **Contenedorización** | Docker | 20.10+ | Reproducibilidad |
| **Orquestación** | Docker Compose | 2.0+ | Desarrollo local |

---

## 📦 Requisitos

### Sistemas Operativos Soportados
- ✅ Linux (Ubuntu 20.04+, Debian 11+)
- ✅ macOS (12+)
- ✅ Windows 10/11 (WSL2 recomendado)

### Dependencias del Sistema

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y \
  python3.11 \
  python3.11-dev \
  python3-pip \
  docker.io \
  docker-compose \
  postgresql-client \
  libpq-dev
```

**macOS:**
```bash
brew install python@3.11 docker postgresql@16
```

**Windows (WSL2):**
```bash
wsl --install Ubuntu-22.04
# Dentro de WSL:
sudo apt-get install python3.11 python3-pip docker.io docker-compose
```

### Requisitos Mínimos
- **Python:** 3.11+
- **RAM:** 2GB (desarrollo), 4GB (producción)
- **Disco:** 2GB libre
- **Docker:** 20.10+
- **Docker Compose:** 2.0+

---

## 🚀 Instalación

### Opción 1: Docker Compose (Recomendado)

#### 1.1 Clonar el repositorio
```bash
git clone https://github.com/tuusuario/threat-detection-backend.git
cd threat-detection-backend
```

#### 1.2 Crear archivo `.env`
```bash
cp .env.example .env
```

#### 1.3 Levantar servicios
```bash
docker-compose up -d
```

#### 1.4 Verificar estado
```bash
docker-compose ps
docker-compose logs -f backend
```

✅ **API disponible en:** `http://localhost:8000`  
📚 **Documentación:** `http://localhost:8000/docs`

---

### Opción 2: Instalación Local (Desarrollo)

#### 2.1 Clonar repositorio
```bash
git clone https://github.com/tuusuario/threat-detection-backend.git
cd threat-detection-backend
```

#### 2.2 Crear entorno virtual
```bash
python3.11 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

#### 2.3 Instalar dependencias
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### 2.4 Configurar base de datos

**Opción A: PostgreSQL local**
```bash
# Linux/macOS
brew install postgresql@16  # macOS
# o
sudo apt-get install postgresql postgresql-contrib  # Linux

# Iniciar servicio
brew services start postgresql@16  # macOS
sudo systemctl start postgresql  # Linux

# Crear BD
psql -U postgres -c "CREATE DATABASE threat_detection;"
psql -U postgres -c "CREATE EXTENSION postgis;" threat_detection
```

**Opción B: PostgreSQL en Docker (sin Docker Compose))**
```bash
docker run -d \
  --name threat-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=securepassword123 \
  -e POSTGRES_DB=threat_detection \
  -p 5432:5432 \
  postgis/postgis:16-3.4
```

#### 2.5 Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env según tu configuración
```

#### 2.6 Inicializar base de datos
```bash
python -c "from database.connection import init_db; init_db()"
```

#### 2.7 Ejecutar servidor
```bash
python main.py
# o con auto-reload:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ **API disponible en:** `http://localhost:8000`

---

## ⚙️ Configuración

### Archivo `.env`

```bash
# ========== DATABASE ==========
DATABASE_URL=postgresql://admin:securepassword123@localhost:5432/threat_detection

# ========== JWT & SEGURIDAD ==========
SECRET_KEY=tu-clave-secreta-super-segura-cambiar-en-produccion
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# ========== EMBEDDINGS ==========
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

# ========== APLICACIÓN ==========
DEBUG=True  # Cambiar a False en producción
ENVIRONMENT=development  # development, staging, production

# ========== LOGGING ==========
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR, CRITICAL
```

### Variables Críticas para Producción

```bash
# ⚠️ CAMBIAR EN PRODUCCIÓN
SECRET_KEY=$(python -c 'import secrets; print(secrets.token_urlsafe(32))')

# BD
DATABASE_URL=postgresql://user:password@db.example.com:5432/threat_db

# Seguridad
DEBUG=False
ENVIRONMENT=production

# CORS
ALLOWED_ORIGINS=https://app.example.com,https://web.example.com
```

---

## 📖 Uso

### 1️⃣ Registro de Usuario

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "123456",
    "email": "admin@example.com"
  }'
```

**Respuesta:**
```json
{
  "id": "uuid-123",
  "username": "admin",
  "email": "admin@example.com",
  "created_at": "2026-03-27T10:30:00"
}
```

---

### 2️⃣ Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "123456"
  }'
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": "uuid-123"
}
```

**Usar token en requests:**
```bash
curl -H "Authorization: Bearer <token>" http://localhost:8000/comments/uuid-123
```

---

### 3️⃣ Subir Audio

```bash
curl -X POST http://localhost:8000/audio \
  -F "file=@audio.wav"
```

**Respuesta:**
```json
{
  "message": "Audio recibido",
  "chunk_id": "chunk-uuid-001"
}
```

---

### 4️⃣ Transcribir Audio

```bash
curl -X POST http://localhost:8000/transcribe \
  -H "Content-Type: application/json" \
  -d '{"chunk_id": "chunk-uuid-001"}'
```

**Respuesta:**
```json
{
  "text": "si no pagas habrá consecuencias",
  "confidence": 1.0
}
```

---

### 5️⃣ Generar Embedding

```bash
curl -X POST http://localhost:8000/embedding \
  -H "Content-Type: application/json" \
  -d '{"text": "si no pagas habrá consecuencias"}'
```

**Respuesta:**
```json
{
  "embedding": [0.123, 0.456, 0.789, ...],
  "model": "all-MiniLM-L6-v2"
}
```

---

### 6️⃣ Analizar Riesgo

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "si no pagas habrá consecuencias"}'
```

**Respuesta:**
```json
{
  "risk": "HIGH",
  "category": "EXTORTION",
  "score": 0.87,
  "keywords": ["pagar", "consecuencias"]
}
```

---

### 7️⃣ Guardar Ubicación

```bash
curl -X POST http://localhost:8000/geo \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-123",
    "lat": -0.1807,
    "lon": -78.4678,
    "description": "evento sospechoso detectado",
    "risk_analysis_id": "risk-uuid-123"
  }'
```

**Respuesta:**
```json
{
  "message": "Ubicación registrada",
  "location_id": "geo-uuid-456"
}
```

---

### 8️⃣ Buscar Eventos Cercanos

```bash
curl "http://localhost:8000/geo/nearby?lat=-0.1807&lon=-78.4678&radius=1000"
```

**Respuesta:**
```json
{
  "nearby_events": [
    {
      "id": "geo-uuid-1",
      "user_id": "user-uuid-1",
      "description": "evento sospechoso",
      "risk": "HIGH",
      "category": "THREAT",
      "text": "si no pagas...",
      "created_at": "2026-03-27T10:30:00"
    }
  ],
  "count": 1
}
```

---

### 9️⃣ Registrar Comentario/Evento

```bash
curl -X POST http://localhost:8000/comments \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-123",
    "text": "posible amenaza detectada",
    "risk": "HIGH",
    "risk_analysis_id": "risk-uuid-123"
  }'
```

**Respuesta:**
```json
{
  "id": "comment-uuid-789",
  "text": "posible amenaza detectada",
  "risk": "HIGH",
  "timestamp": "2026-03-27T10:30:00"
}
```

---

### 🔟 Obtener Historial

```bash
curl "http://localhost:8000/comments/uuid-123?limit=50"
```

**Respuesta:**
```json
{
  "user_id": "uuid-123",
  "count": 5,
  "events": [
    {
      "id": "comment-uuid-1",
      "text": "posible amenaza detectada",
      "risk": "HIGH",
      "timestamp": "2026-03-27T10:30:00"
    },
    ...
  ]
}
```

---

### Health Check

```bash
curl http://localhost:8000/health
```

**Respuesta:**
```json
{
  "status": "ok",
  "database": "ok"
}
```

---

## 🔌 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Crear usuario | ❌ No |
| `POST` | `/auth/login` | Obtener JWT token | ❌ No |
| `GET` | `/auth/me` | Datos del usuario actual | ✅ Sí |

### Audio & Transcripción

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| `POST` | `/audio` | Subir chunk de audio | ❌ No |
| `POST` | `/transcribe` | Convertir audio a texto | ❌ No |

### Análisis

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| `POST` | `/analyze` | Analizar riesgo de texto | ❌ No |
| `POST` | `/embedding` | Generar embedding vectorial | ❌ No |

### Geolocalización

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| `POST` | `/geo` | Registrar ubicación | ❌ No |
| `GET` | `/geo/nearby` | Buscar eventos cercanos | ❌ No |
| `GET` | `/geo/user/{user_id}` | Ubicaciones de usuario | ❌ No |

### Historial

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| `POST` | `/comments` | Crear comentario/evento | ❌ No |
| `GET` | `/comments/{user_id}` | Historial de usuario | ❌ No |

### Monitoreo

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| `GET` | `/health` | Estado del sistema | ❌ No |

---

## 📁 Estructura del Proyecto

```
threat-detection-backend/
│
├── README.md                    # Este archivo
├── requirements.txt             # Dependencias Python
├── .env.example                 # Plantilla de variables
├── .gitignore                   # Archivos ignorados
├── Dockerfile                   # Imagen Docker
├── docker-compose.yml           # Orquestación local
│
├── main.py                      # 🎯 Punto de entrada
│
├── routes/                      # 📍 Endpoints
│   ├── __init__.py
│   ├── auth.py                  # POST /auth/register, /auth/login
│   ├── audio.py                 # POST /audio
│   ├── transcribe.py            # POST /transcribe
│   ├── analyze.py               # POST /analyze
│   ├── embedding.py             # POST /embedding
│   ├── geo.py                   # POST /geo, GET /geo/nearby
│   ├── comments.py              # POST /comments, GET /comments/{user_id}
│   └── health.py                # GET /health
│
├── services/                    # 🧠 Lógica de Negocio
│   ├── __init__.py
│   ├── auth_service.py          # JWT, hash, registro
│   ├── stt_service.py           # Transcripción (mock + real)
│   ├── detection_service.py     # Análisis de riesgos
│   ├── embedding_service.py     # Vectorización
│   └── geo_service.py           # Queries geoespaciales
│
├── models/                      # 📊 Esquemas & BD
│   ├── __init__.py
│   ├── database.py              # Modelos SQLAlchemy (tablas)
│   ├── schemas.py               # Validación Pydantic (request/response)
│   └── enums.py                 # Tipos (RiskLevel, RiskCategory)
│
├── database/                    # 🗄️ Configuración BD
│   ├── __init__.py
│   └── connection.py            # Setup PostgreSQL, SessionLocal
│
├── uploads/                     # 📁 Archivos temporales
│   └── audio/                   # Chunks de audio subidos
│
└── logs/                        # 📝 Logs de aplicación
    └── app.log
```

### Descripción de Directorios

#### `routes/`
Contiene todos los endpoints REST. Cada archivo es un módulo de rutas:
- Valida request/response con Pydantic
- Llama a services para lógica
- Retorna respuestas JSON

#### `services/`
Contiene la lógica de negocio (desacoplada de HTTP):
- Operaciones con BD
- Procesamiento de datos
- Llamadas a APIs externas
- Detección de amenazas

#### `models/`
Define estructuras de datos:
- `database.py`: Tablas PostgreSQL (SQLAlchemy ORM)
- `schemas.py`: Validación de request/response (Pydantic)
- `enums.py`: Tipos personalizados

#### `database/`
Configuración de conexión:
- Inicialización de BD
- SessionLocal para inyección
- Pool de conexiones

---

## 🛠️ Development

### Entorno de Desarrollo

```bash
# Activar venv
source venv/bin/activate

# Instalar en modo desarrollo (incluye pytest, black, etc)
pip install -r requirements-dev.txt

# Ejecutar con auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Ver logs en tiempo real
tail -f logs/app.log
```

### Estructura de Commits

```bash
# Feature
git commit -m "feat: agregar endpoint de análisis de riesgos"

# Bug fix
git commit -m "fix: corregir query geoespacial en POST /geo"

# Documentación
git commit -m "docs: actualizar README con ejemplos"

# Tests
git commit -m "test: agregar tests para AuthService"

# Refactor
git commit -m "refactor: mejorar estructura de DetectionService"
```

### Convenciones de Código

```python
# ✅ BIEN
def analyze_text(text: str) -> AnalysisResponse:
    """Analiza riesgo de un texto."""
    if not text:
        raise ValueError("Text cannot be empty")
    # lógica...

# ❌ MAL
def analyze(t):
    if t == "":
        return None
    # sin tipo hints, sin docstring
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
pytest

# Con cobertura
pytest --cov=. --cov-report=html

# Un archivo específico
pytest tests/test_auth.py -v

# Una función específica
pytest tests/test_auth.py::test_register_user -v
```

### Ejemplo: Test de Registro

```python
# tests/test_auth.py
def test_register_user(client, db):
    response = client.post("/auth/register", json={
        "username": "testuser",
        "password": "secure123",
        "email": "test@example.com"
    })
    
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"
    assert response.json()["id"]
```

### Cobertura de Tests

- ✅ Autenticación (auth_service.py)
- ✅ Análisis de riesgos (detection_service.py)
- ✅ Geolocalización (geo_service.py)
- ✅ Embeddings (embedding_service.py)
- ✅ Endpoints HTTP (routes/)

---

## 📦 Deployment

### 1. Preparar para Producción

```bash
# Cambiar .env
DEBUG=False
ENVIRONMENT=production
SECRET_KEY=$(python -c 'import secrets; print(secrets.token_urlsafe(32))')

# Generar nueva clave
DATABASE_URL=postgresql://user:securepass@prod-db.com:5432/threat_db
```

### 2. Build Docker

```bash
# Build imagen
docker build -t threat-detection-api:1.0.0 .

# Tag para registry
docker tag threat-detection-api:1.0.0 tu-registry.com/threat-detection-api:1.0.0

# Push
docker push tu-registry.com/threat-detection-api:1.0.0
```

### 3. Deploy en Kubernetes

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: threat-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: threat-api
  template:
    metadata:
      labels:
        app: threat-api
    spec:
      containers:
      - name: api
        image: tu-registry.com/threat-detection-api:1.0.0
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: threat-secrets
              key: db_url
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
```

```bash
# Deploy
kubectl apply -f k8s-deployment.yaml
kubectl apply -f k8s-service.yaml
```

### 4. Deploy en Heroku

```bash
# Login
heroku login

# Crear app
heroku create threat-detection-api

# Variables de entorno
heroku config:set DATABASE_URL=postgresql://...
heroku config:set SECRET_KEY=$(python -c 'import secrets; print(secrets.token_urlsafe(32))')

# Deploy
git push heroku main

# Ver logs
heroku logs -t
```

### 5. Deploy en AWS ECS

```bash
# Crear cluster
aws ecs create-cluster --cluster-name threat-detection

# Crear task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Crear servicio
aws ecs create-service \
  --cluster threat-detection \
  --service-name threat-api \
  --task-definition threat-api:1 \
  --desired-count 3 \
  --launch-type EC2
```

---

## 🚨 Troubleshooting

### Problema: "connection refused" en PostgreSQL

```bash
# Verificar que BD esté corriendo
docker ps | grep postgres

# Si no está:
docker-compose up -d postgres

# Esperar 10 segundos y reintentar
sleep 10
curl http://localhost:8000/health
```

### Problema: Error de módulos no encontrados

```bash
# Asegurar que venv está activado
source venv/bin/activate

# Reinstalar dependencias
pip install --force-reinstall -r requirements.txt
```

### Problema: Puerto 8000 ya está en uso

```bash
# Encontrar proceso
lsof -i :8000

# Matar proceso
kill -9 <PID>

# O usar otro puerto
uvicorn main:app --port 8001
```

### Problema: BD no inicializa

```bash
# Ver logs de postgres
docker-compose logs postgres

# Resetear BD
docker-compose down -v  # Elimina volúmenes
docker-compose up -d
```

### Problema: JWT token expirado

**Solución:** Hacer login nuevamente para obtener nuevo token

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "123456"}'
```

### Problema: Embeddings muy lentos

**Problema:** Primer request descarga modelo (~400MB)

**Solución:** Pre-descargar modelo:
```python
python -c "from sentence_transformers import SentenceTransformer; \
SentenceTransformer('all-MiniLM-L6-v2')"
```

---

## 📊 Monitoreo en Producción

### Métricas Clave

```python
# Agregar a main.py para Prometheus
from prometheus_client import Counter, Histogram, start_http_server

REQUEST_COUNT = Counter('http_requests_total', 'Total requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'Request duration')

# Iniciar en puerto 8001
start_http_server(8001)
```

### Logs Estructurados

```python
import logging
import json

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

logger = logging.getLogger(__name__)
logger.info(json.dumps({"user_id": "uuid-123", "action": "login"}))
```

### Alertas Recomendadas

| Alerta | Umbral | Acción |
|--------|--------|--------|
| Tasa de error | >5% | Escalar |
| DB latencia | >500ms | Revisar queries |
| Memoria | >80% | Reiniciar |
| Disk | >90% | Limpiar logs |

---

## 🔒 Seguridad

### Checklist de Seguridad

- ✅ HTTPS en producción
- ✅ JWT firmado con clave segura
- ✅ Contraseñas hasheadas (bcrypt)
- ✅ Rate limiting en endpoints
- ✅ CORS restringido a dominios autorizados
- ✅ SQL injection previsto (SQLAlchemy ORM)
- ✅ CSRF tokens (si aplica)
- ✅ Validación de entrada (Pydantic)
- ✅ Logs de auditoría
- ✅ Secretos en .env (NO en repo)

### Proteger Secretos

```bash
# NO hacer esto ❌
SECRET_KEY=miclaveaquí  # En el código

# Hacer esto ✅
# En .env
SECRET_KEY=<generada aleatoriamente>

# En CI/CD
export SECRET_KEY=$(aws secretsmanager get-secret-value ...)
```

---

## 📈 Roadmap

### v1.1 (Próximas 2 semanas)
- [ ] Integración con Whisper para STT real
- [ ] Búsqueda semántica con embeddings
- [ ] Dashboard de estadísticas
- [ ] Export de datos (CSV, PDF)

### v1.2 (Próximo mes)
- [ ] Integración con LLM (Claude, GPT)
- [ ] Vector DB (Qdrant, Pinecone)
- [ ] Alertas por WebSocket
- [ ] App móvil (iOS + Android)

### v2.0 (Visión futura)
- [ ] Machine learning custom
- [ ] Análisis de patrones
- [ ] Predicción de riesgos
- [ ] Integración con sistemas de emergencia

---

## 🤝 Contribución

### Reportar Bugs

1. Verificar que el issue no existe
2. Crear nuevo issue con:
   - Descripción clara
   - Pasos para reproducir
   - Versión de Python/FastAPI
   - Logs de error

### Proponer Features

1. Abrir discussion
2. Describir caso de uso
3. Proponer implementación
4. Esperar feedback

### Pull Requests

```bash
# 1. Fork el repo
git clone https://github.com/tu-usuario/threat-detection-backend.git

# 2. Crear rama
git checkout -b feat/nueva-feature

# 3. Hacer cambios + tests
git add .
git commit -m "feat: descripción clara"

# 4. Push
git push origin feat/nueva-feature

# 5. Crear Pull Request
# (GitHub web interface)
```

### Código Style

```bash
# Formatear con Black
black . --line-length=100

# Linting con Flake8
flake8 . --max-line-length=100

# Ordenar imports
isort .
```

---

## 📄 Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

## 👥 Autores

- **Tu Nombre** - Backend Lead
- **Contribuidores** - [Ver lista completa](CONTRIBUTORS.md)

---

## 📞 Contacto & Soporte

- 📧 **Email:** soporte@example.com
- 💬 **Discord:** [Servidor Community](https://discord.gg/example)
- 🐛 **Issues:** [GitHub Issues](https://github.com/tuusuario/threat-detection-backend/issues)
- 📖 **Docs:** [Wiki](https://github.com/tuusuario/threat-detection-backend/wiki)

---

## 🙏 Agradecimientos

- Equipo de FastAPI por el framework increíble
- Comunidad PostgreSQL por PostGIS
- SentenceTransformers por el modelo de embeddings

---

## 📝 Cambios Recientes

### v1.0.0 (2026-03-27)
- ✅ Lanzamiento inicial
- ✅ Autenticación JWT completa
- ✅ Análisis de riesgos basado en reglas
- ✅ Soporte geoespacial con PostGIS
- ✅ Dockerizado y listo para producción

---

**Hecho con ❤️ para la seguridad pública**

[⬆ Volver al inicio](#threat-detection-api-backend)
