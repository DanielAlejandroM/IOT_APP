================================================================================
                     THREAT DETECTION API BACKEND
        Sistema de detección temprana de amenazas con análisis de audio/texto
                           y geolocalización en tiempo real
================================================================================

Una API robusta para identificar, clasificar y rastrear eventos de riesgo.

INFORMACIÓN DEL PROYECTO:
- Lenguaje: Python 3.11+
- Framework: FastAPI 0.104+
- Base de Datos: PostgreSQL 16+ + PostGIS 3.4+
- Contenedor: Docker 20.10+
- Licencia: MIT

================================================================================
TABLA DE CONTENIDOS
================================================================================

1. CARACTERÍSTICAS
2. ARQUITECTURA
3. REQUISITOS
4. INSTALACIÓN
5. CONFIGURACIÓN
6. USO
7. API ENDPOINTS
8. ESTRUCTURA DEL PROYECTO
9. DESARROLLO
10. TESTING
11. DEPLOYMENT
12. TROUBLESHOOTING
13. SEGURIDAD
14. ROADMAP
15. CONTRIBUCIÓN

================================================================================
1. CARACTERÍSTICAS
================================================================================

AUTENTICACIÓN & SEGURIDAD
✓ Registro de usuarios con contraseña hasheada (bcrypt)
✓ Autenticación JWT con tokens seguros
✓ Control de acceso por usuario
✓ CORS configurado para desarrollo

PROCESAMIENTO DE AUDIO
✓ Recepción de chunks de audio (WAV, MP3, etc)
✓ Almacenamiento seguro en servidor
✓ Mock STT (Speech-to-Text) integrado
✓ Listo para integración con Whisper/Google Speech

ANÁLISIS INTELIGENTE
✓ Detección de amenazas basada en reglas
✓ Clasificación automática (EXTORTION, THREAT, HARASSMENT, FRAUD)
✓ Scoring de riesgo (0.0 - 1.0)
✓ Extracción de palabras clave
✓ Niveles de riesgo: LOW, MEDIUM, HIGH, CRITICAL

EMBEDDINGS VECTORIALES
✓ Vectorización de texto con SentenceTransformers
✓ Modelo: all-MiniLM-L6-v2 (384 dimensiones)
✓ Búsqueda semántica preparada
✓ Mock embeddings para desarrollo

GEOLOCALIZACIÓN AVANZADA
✓ Almacenamiento de eventos con coordenadas GPS
✓ Índices espaciales con PostGIS
✓ Búsqueda de eventos cercanos (ST_DWithin)
✓ Historial geolocalizado por usuario

HISTORIAL & AUDITORÍA
✓ Registro completo de eventos
✓ Timestamps automáticos
✓ Historial por usuario
✓ Trazabilidad de acciones

PRODUCCIÓN-READY
✓ Dockerizado con docker-compose
✓ Migraciones de BD automáticas
✓ Health checks integrados
✓ Documentación interactiva (Swagger/OpenAPI)
✓ Logging estructurado

================================================================================
2. ARQUITECTURA
================================================================================

DIAGRAMA DE FLUJO:

┌─────────────────────┐
│   Kotlin App        │  ← Captura audio + ubicación
└──────────┬──────────┘
           │ HTTP/JSON
           ↓
┌──────────────────────────────────────┐
│     FastAPI Backend (Python)         │
│                                      │
│  Routes (Endpoints):                 │
│  - /auth      → Autenticación        │
│  - /audio     → Recepción            │
│  - /transcribe→ STT Mock             │
│  - /analyze   → Detección            │
│  - /embedding → Vectorización        │
│  - /geo       → Ubicaciones          │
│  - /comments  → Historial            │
│  - /health    → Monitoreo            │
│                                      │
│  Services (Lógica):                  │
│  - AuthService       (JWT)           │
│  - STTService        (Audio)         │
│  - DetectionService  (IA)            │
│  - EmbeddingService  (Vec)           │
│  - GeoService        (Geo)           │
└──────────┬───────────────────────────┘
           │ SQL/GIS
           ↓
┌──────────────────────────────────────┐
│   PostgreSQL 16 + PostGIS 3.4        │
│                                      │
│  Tablas:                             │
│  - users                             │
│  - audio_chunks                      │
│  - transcriptions                    │
│  - embeddings                        │
│  - risk_analysis                     │
│  - geolocations (GEOMETRY POINT)     │
│  - comments                          │
└──────────────────────────────────────┘

STACK TECNOLÓGICO:

Capa          Tecnología              Versión    Propósito
────────────────────────────────────────────────────────────
Framework     FastAPI                 0.104+     API REST
Server        Uvicorn                 0.24+      Servidor ASGI
ORM           SQLAlchemy              2.0+       Mapeo de BD
BD Principal  PostgreSQL              16+        Datos relacionales
Extensión     PostGIS                 3.4+       Datos geoespaciales
Autenticación Python-Jose             3.3+       JWT tokens
Hashing       Passlib + Bcrypt        1.7+       Contraseñas seguras
Embeddings    SentenceTransformers    2.2+       Vectorización
Contenedor    Docker                  20.10+     Reproducibilidad
Orquestación  Docker Compose          2.0+       Desarrollo local

================================================================================
3. REQUISITOS
================================================================================

SISTEMAS OPERATIVOS SOPORTADOS:
✓ Linux (Ubuntu 20.04+, Debian 11+)
✓ macOS (12+)
✓ Windows 10/11 (WSL2 recomendado)

REQUISITOS MÍNIMOS:
- Python: 3.11+
- RAM: 2GB (desarrollo), 4GB (producción)
- Disco: 2GB libre
- Docker: 20.10+
- Docker Compose: 2.0+

INSTALACIÓN DE DEPENDENCIAS DEL SISTEMA:

Linux (Ubuntu/Debian):
sudo apt-get update
sudo apt-get install -y python3.11 python3.11-dev python3-pip docker.io docker-compose postgresql-client libpq-dev

macOS:
brew install python@3.11 docker postgresql@16

Windows (WSL2):
wsl --install Ubuntu-22.04
# Dentro de WSL:
sudo apt-get install python3.11 python3-pip docker.io docker-compose

================================================================================
4. INSTALACIÓN
================================================================================

OPCIÓN 1: DOCKER COMPOSE (RECOMENDADO)

Paso 1.1: Clonar repositorio
git clone https://github.com/tuusuario/threat-detection-backend.git
cd threat-detection-backend

Paso 1.2: Crear archivo .env
cp .env.example .env

Paso 1.3: Levantar servicios
docker-compose up -d

Paso 1.4: Verificar estado
docker-compose ps
docker-compose logs -f backend

RESULTADO: API disponible en http://localhost:8000
           Documentación en http://localhost:8000/docs

---

OPCIÓN 2: INSTALACIÓN LOCAL (DESARROLLO)

Paso 2.1: Clonar repositorio
git clone https://github.com/tuusuario/threat-detection-backend.git
cd threat-detection-backend

Paso 2.2: Crear entorno virtual
python3.11 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

Paso 2.3: Instalar dependencias
pip install --upgrade pip
pip install -r requirements.txt

Paso 2.4: Configurar base de datos

Opción A: PostgreSQL local
# Linux/macOS
brew install postgresql@16  # macOS
sudo apt-get install postgresql postgresql-contrib  # Linux

# Iniciar servicio
brew services start postgresql@16  # macOS
sudo systemctl start postgresql  # Linux

# Crear BD
psql -U postgres -c "CREATE DATABASE threat_detection;"
psql -U postgres -c "CREATE EXTENSION postgis;" threat_detection

Opción B: PostgreSQL en Docker
docker run -d --name threat-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=securepassword123 \
  -e POSTGRES_DB=threat_detection \
  -p 5432:5432 \
  postgis/postgis:16-3.4

Paso 2.5: Configurar variables de entorno
cp .env.example .env
# Editar .env según tu configuración

Paso 2.6: Inicializar base de datos
python -c "from database.connection import init_db; init_db()"

Paso 2.7: Ejecutar servidor
python main.py
# O con auto-reload:
uvicorn main:app --reload --host 0.0.0.0 --port 8000

RESULTADO: API disponible en http://localhost:8000

================================================================================
5. CONFIGURACIÓN
================================================================================

ARCHIVO .env:

# BASE DE DATOS
DATABASE_URL=postgresql://admin:securepassword123@localhost:5432/threat_detection

# JWT & SEGURIDAD
SECRET_KEY=tu-clave-secreta-super-segura-cambiar-en-produccion
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# EMBEDDINGS
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

# APLICACIÓN
DEBUG=True  # Cambiar a False en producción
ENVIRONMENT=development  # development, staging, production

# LOGGING
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR, CRITICAL

---

VARIABLES CRÍTICAS PARA PRODUCCIÓN:

# Generar clave segura
SECRET_KEY=$(python -c 'import secrets; print(secrets.token_urlsafe(32))')

# Base de datos remota
DATABASE_URL=postgresql://user:password@db.example.com:5432/threat_db

# Seguridad
DEBUG=False
ENVIRONMENT=production

# CORS
ALLOWED_ORIGINS=https://app.example.com,https://web.example.com

================================================================================
6. USO
================================================================================

1. REGISTRO DE USUARIO
---

URL: POST http://localhost:8000/auth/register
Content-Type: application/json

Request:
{
  "username": "admin",
  "password": "123456",
  "email": "admin@example.com"
}

Response (200 OK):
{
  "id": "uuid-123",
  "username": "admin",
  "email": "admin@example.com",
  "created_at": "2026-03-27T10:30:00"
}

Comando CURL:
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "123456",
    "email": "admin@example.com"
  }'

---

2. LOGIN
---

URL: POST http://localhost:8000/auth/login
Content-Type: application/json

Request:
{
  "username": "admin",
  "password": "123456"
}

Response (200 OK):
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": "uuid-123"
}

Comando CURL:
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "123456"
  }'

Usar token en requests:
curl -H "Authorization: Bearer <token>" http://localhost:8000/comments/uuid-123

---

3. SUBIR AUDIO
---

URL: POST http://localhost:8000/audio
Content-Type: multipart/form-data

Request:
- file: audio.wav (archivo binario)

Response (200 OK):
{
  "message": "Audio recibido",
  "chunk_id": "chunk-uuid-001"
}

Comando CURL:
curl -X POST http://localhost:8000/audio \
  -F "file=@audio.wav"

---

4. TRANSCRIBIR AUDIO (MOCK)
---

URL: POST http://localhost:8000/transcribe
Content-Type: application/json

Request:
{
  "chunk_id": "chunk-uuid-001"
}

Response (200 OK):
{
  "text": "si no pagas habrá consecuencias",
  "confidence": 1.0
}

Comando CURL:
curl -X POST http://localhost:8000/transcribe \
  -H "Content-Type: application/json" \
  -d '{"chunk_id": "chunk-uuid-001"}'

---

5. GENERAR EMBEDDING
---

URL: POST http://localhost:8000/embedding
Content-Type: application/json

Request:
{
  "text": "si no pagas habrá consecuencias"
}

Response (200 OK):
{
  "embedding": [0.123, 0.456, 0.789, ...],
  "model": "all-MiniLM-L6-v2"
}

Comando CURL:
curl -X POST http://localhost:8000/embedding \
  -H "Content-Type: application/json" \
  -d '{"text": "si no pagas habrá consecuencias"}'

---

6. ANALIZAR RIESGO
---

URL: POST http://localhost:8000/analyze
Content-Type: application/json

Request:
{
  "text": "si no pagas habrá consecuencias"
}

Response (200 OK):
{
  "risk": "HIGH",
  "category": "EXTORTION",
  "score": 0.87,
  "keywords": ["pagar", "consecuencias"]
}

Comando CURL:
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "si no pagas habrá consecuencias"}'

---

7. GUARDAR UBICACIÓN
---

URL: POST http://localhost:8000/geo
Content-Type: application/json

Request:
{
  "user_id": "uuid-123",
  "lat": -0.1807,
  "lon": -78.4678,
  "description": "evento sospechoso detectado",
  "risk_analysis_id": "risk-uuid-123"
}

Response (200 OK):
{
  "message": "Ubicación registrada",
  "location_id": "geo-uuid-456"
}

Comando CURL:
curl -X POST http://localhost:8000/geo \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-123",
    "lat": -0.1807,
    "lon": -78.4678,
    "description": "evento sospechoso detectado"
  }'

---

8. BUSCAR EVENTOS CERCANOS
---

URL: GET http://localhost:8000/geo/nearby?lat=-0.1807&lon=-78.4678&radius=1000

Response (200 OK):
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

Comando CURL:
curl "http://localhost:8000/geo/nearby?lat=-0.1807&lon=-78.4678&radius=1000"

---

9. REGISTRAR COMENTARIO/EVENTO
---

URL: POST http://localhost:8000/comments
Content-Type: application/json

Request:
{
  "user_id": "uuid-123",
  "text": "posible amenaza detectada",
  "risk": "HIGH",
  "risk_analysis_id": "risk-uuid-123"
}

Response (200 OK):
{
  "id": "comment-uuid-789",
  "text": "posible amenaza detectada",
  "risk": "HIGH",
  "timestamp": "2026-03-27T10:30:00"
}

Comando CURL:
curl -X POST http://localhost:8000/comments \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-123",
    "text": "posible amenaza detectada",
    "risk": "HIGH"
  }'

---

10. OBTENER HISTORIAL
---

URL: GET http://localhost:8000/comments/{user_id}?limit=50

Response (200 OK):
{
  "user_id": "uuid-123",
  "count": 5,
  "events": [
    {
      "id": "comment-uuid-1",
      "text": "posible amenaza detectada",
      "risk": "HIGH",
      "timestamp": "2026-03-27T10:30:00"
    }
  ]
}

Comando CURL:
curl "http://localhost:8000/comments/uuid-123?limit=50"

---

11. HEALTH CHECK
---

URL: GET http://localhost:8000/health

Response (200 OK):
{
  "status": "ok",
  "database": "ok"
}

Comando CURL:
curl http://localhost:8000/health

================================================================================
7. API ENDPOINTS
================================================================================

AUTENTICACIÓN:

Método  Endpoint                 Descripción               Requiere Auth
──────────────────────────────────────────────────────────────────────
POST    /auth/register           Crear usuario             NO
POST    /auth/login              Obtener JWT token         NO
GET     /auth/me                 Datos del usuario actual  SÍ

AUDIO & TRANSCRIPCIÓN:

Método  Endpoint                 Descripción               Requiere Auth
──────────────────────────────────────────────────────────────────────
POST    /audio                   Subir chunk de audio      NO
POST    /transcribe              Convertir audio a texto   NO

ANÁLISIS:

Método  Endpoint                 Descripción               Requiere Auth
──────────────────────────────────────────────────────────────────────
POST    /analyze                 Analizar riesgo de texto  NO
POST    /embedding               Generar embedding         NO

GEOLOCALIZACIÓN:

Método  Endpoint                 Descripción               Requiere Auth
──────────────────────────────────────────────────────────────────────
POST    /geo                     Registrar ubicación       NO
GET     /geo/nearby              Buscar eventos cercanos   NO
GET     /geo/user/{user_id}      Ubicaciones de usuario    NO

HISTORIAL:

Método  Endpoint                 Descripción               Requiere Auth
──────────────────────────────────────────────────────────────────────
POST    /comments                Crear comentario/evento   NO
GET     /comments/{user_id}      Historial de usuario      NO

MONITOREO:

Método  Endpoint                 Descripción               Requiere Auth
──────────────────────────────────────────────────────────────────────
GET     /health                  Estado del sistema        NO

================================================================================
8. ESTRUCTURA DEL PROYECTO
================================================================================

threat-detection-backend/
│
├── README.md                    # Documentación principal
├── requirements.txt             # Dependencias Python
├── .env.example                 # Plantilla de variables
├── .gitignore                   # Archivos ignorados
├── Dockerfile                   # Imagen Docker
├── docker-compose.yml           # Orquestación local
│
├── main.py                      # Punto de entrada
│
├── routes/                      # Endpoints HTTP
│   ├── __init__.py
│   ├── auth.py                  # /auth/register, /auth/login
│   ├── audio.py                 # /audio
│   ├── transcribe.py            # /transcribe
│   ├── analyze.py               # /analyze
│   ├── embedding.py             # /embedding
│   ├── geo.py                   # /geo, /geo/nearby
│   ├── comments.py              # /comments, /comments/{user_id}
│   └── health.py                # /health
│
├── services/                    # Lógica de Negocio
│   ├── __init__.py
│   ├── auth_service.py          # JWT, hash, registro
│   ├── stt_service.py           # Transcripción (mock + real)
│   ├── detection_service.py     # Análisis de riesgos
│   ├── embedding_service.py     # Vectorización
│   └── geo_service.py           # Queries geoespaciales
│
├── models/                      # Esquemas & BD
│   ├── __init__.py
│   ├── database.py              # Modelos SQLAlchemy (tablas)
│   ├── schemas.py               # Validación Pydantic
│   └── enums.py                 # Tipos (RiskLevel, etc)
│
├── database/                    # Configuración BD
│   ├── __init__.py
│   └── connection.py            # Setup PostgreSQL
│
├── uploads/                     # Archivos temporales
│   └── audio/                   # Chunks de audio
│
└── logs/                        # Logs de aplicación
    └── app.log

DESCRIPCIÓN DE DIRECTORIOS:

routes/
- Contiene todos los endpoints REST
- Valida request/response con Pydantic
- Llama a services para lógica
- Retorna respuestas JSON

services/
- Contiene la lógica de negocio (desacoplada de HTTP)
- Operaciones con BD
- Procesamiento de datos
- Llamadas a APIs externas
- Detección de amenazas

models/
- database.py: Tablas PostgreSQL (SQLAlchemy ORM)
- schemas.py: Validación de request/response (Pydantic)
- enums.py: Tipos personalizados

database/
- Configuración de conexión
- Inicialización de BD
- SessionLocal para inyección

================================================================================
9. DESARROLLO
================================================================================

ENTORNO DE DESARROLLO:

# Activar venv
source venv/bin/activate

# Instalar en modo desarrollo
pip install -r requirements-dev.txt

# Ejecutar con auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Ver logs
tail -f logs/app.log

---

ESTRUCTURA DE COMMITS:

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

---

CONVENCIONES DE CÓDIGO:

✓ BIEN:
def analyze_text(text: str) -> AnalysisResponse:
    """Analiza riesgo de un texto."""
    if not text:
        raise ValueError("Text cannot be empty")
    # lógica...

✗ MAL:
def analyze(t):
    if t == "":
        return None
    # sin tipo hints, sin docstring

================================================================================
10. TESTING
================================================================================

EJECUTAR TESTS:

# Todos los tests
pytest

# Con cobertura
pytest --cov=. --cov-report=html

# Un archivo específico
pytest tests/test_auth.py -v

# Una función específica
pytest tests/test_auth.py::test_register_user -v

---

EJEMPLO: TEST DE REGISTRO

def test_register_user(client, db):
    response = client.post("/auth/register", json={
        "username": "testuser",
        "password": "secure123",
        "email": "test@example.com"
    })
    
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"
    assert response.json()["id"]

---

COBERTURA DE TESTS:

✓ Autenticación (auth_service.py)
✓ Análisis de riesgos (detection_service.py)
✓ Geolocalización (geo_service.py)
✓ Embeddings (embedding_service.py)
✓ Endpoints HTTP (routes/)

================================================================================
11. DEPLOYMENT
================================================================================

PREPARAR PARA PRODUCCIÓN:

# Cambiar .env
DEBUG=False
ENVIRONMENT=production
SECRET_KEY=$(python -c 'import secrets; print(secrets.token_urlsafe(32))')

DATABASE_URL=postgresql://user:securepass@prod-db.com:5432/threat_db

---

BUILD DOCKER:

# Build imagen
docker build -t threat-detection-api:1.0.0 .

# Tag para registry
docker tag threat-detection-api:1.0.0 tu-registry.com/threat-detection-api:1.0.0

# Push
docker push tu-registry.com/threat-detection-api:1.0.0

---

DEPLOY EN KUBERNETES:

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

kubectl apply -f k8s-deployment.yaml
kubectl apply -f k8s-service.yaml

---

DEPLOY EN HEROKU:

heroku login
heroku create threat-detection-api

heroku config:set DATABASE_URL=postgresql://...
heroku config:set SECRET_KEY=$(python -c 'import secrets; print(secrets.token_urlsafe(32))')

git push heroku main
heroku logs -t

---

DEPLOY EN AWS ECS:

aws ecs create-cluster --cluster-name threat-detection

aws ecs register-task-definition --cli-input-json file://task-definition.json

aws ecs create-service \
  --cluster threat-detection \
  --service-name threat-api \
  --task-definition threat-api:1 \
  --desired-count 3 \
  --launch-type EC2

================================================================================
12. TROUBLESHOOTING
================================================================================

PROBLEMA: "connection refused" en PostgreSQL

Solución:
docker ps | grep postgres

Si no está:
docker-compose up -d postgres

sleep 10
curl http://localhost:8000/health

---

PROBLEMA: Error de módulos no encontrados

Solución:
source venv/bin/activate
pip install --force-reinstall -r requirements.txt

---

PROBLEMA: Puerto 8000 ya está en uso

Solución:
lsof -i :8000
kill -9 <PID>

O usar otro puerto:
uvicorn main:app --port 8001

---

PROBLEMA: BD no inicializa

Solución:
docker-compose logs postgres
docker-compose down -v  # Elimina volúmenes
docker-compose up -d

---

PROBLEMA: JWT token expirado

Solución:
Hacer login nuevamente

curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "123456"}'

---

PROBLEMA: Embeddings muy lentos

Problema: Primer request descarga modelo (~400MB)

Solución:
python -c "from sentence_transformers import SentenceTransformer; \
SentenceTransformer('all-MiniLM-L6-v2')"

================================================================================
13. SEGURIDAD
================================================================================

CHECKLIST DE SEGURIDAD:

✓ HTTPS en producción
✓ JWT firmado con clave segura
✓ Contraseñas hasheadas (bcrypt)
✓ Rate limiting en endpoints
✓ CORS restringido a dominios autorizados
✓ SQL injection previsto (SQLAlchemy ORM)
✓ CSRF tokens (si aplica)
✓ Validación de entrada (Pydantic)
✓ Logs de auditoría
✓ Secretos en .env (NO en repo)

---

PROTEGER SECRETOS:

✗ NO hacer esto:
SECRET_KEY=miclaveaquí  # En el código

✓ Hacer esto:
# En .env
SECRET_KEY=<generada aleatoriamente>

# En CI/CD
export SECRET_KEY=$(aws secretsmanager get-secret-value ...)

================================================================================
14. ROADMAP
================================================================================

v1.1 (Próximas 2 semanas):
- Integración con Whisper para STT real
- Búsqueda semántica con embeddings
- Dashboard de estadísticas
- Export de datos (CSV, PDF)

v1.2 (Próximo mes):
- Integración con LLM (Claude, GPT)
- Vector DB (Qdrant, Pinecone)
- Alertas por WebSocket
- App móvil (iOS + Android)

v2.0 (Visión futura):
- Machine learning custom
- Análisis de patrones
- Predicción de riesgos
- Integración con sistemas de emergencia

================================================================================
15. CONTRIBUCIÓN
================================================================================

REPORTAR BUGS:

1. Verificar que el issue no existe
2. Crear nuevo issue con:
   - Descripción clara
   - Pasos para reproducir
   - Versión de Python/FastAPI
   - Logs de error

---

PROPONER FEATURES:

1. Abrir discussion
2. Describir caso de uso
3. Proponer implementación
4. Esperar feedback

---

PULL REQUESTS:

git clone https://github.com/tu-usuario/threat-detection-backend.git

git checkout -b feat/nueva-feature

git add .
git commit -m "feat: descripción clara"

git push origin feat/nueva-feature

# Crear Pull Request en GitHub web

---

CÓDIGO STYLE:

black . --line-length=100
flake8 . --max-line-length=100
isort .

================================================================================
LICENCIA
================================================================================

Distribuido bajo la Licencia MIT. Ver LICENSE para más detalles.

================================================================================
AUTORES
================================================================================

Tu Nombre - Backend Lead
Contribuidores - Ver CONTRIBUTORS.md

================================================================================
CONTACTO & SOPORTE
================================================================================

Email: soporte@example.com
Discord: Servidor Community
GitHub Issues: https://github.com/tuusuario/threat-detection-backend/issues
Docs Wiki: https://github.com/tuusuario/threat-detection-backend/wiki

================================================================================
AGRADECIMIENTOS
================================================================================

Equipo de FastAPI por el framework increíble
Comunidad PostgreSQL por PostGIS
SentenceTransformers por el modelo de embeddings

================================================================================
CAMBIOS RECIENTES
================================================================================

v1.0.0 (2026-03-27):
✓ Lanzamiento inicial
✓ Autenticación JWT completa
✓ Análisis de riesgos basado en reglas
✓ Soporte geoespacial con PostGIS
✓ Dockerizado y listo para producción

================================================================================

Hecho con amor para la seguridad pública

Volver al inicio: Ver el archivo desde el principio

================================================================================
