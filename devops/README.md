# despliegue 

Repositorio conectado correctamente desde local. (26/03 - 23:12)
Primer flujo de ramas y PR funcionando

Inicio de creación de infraestructura

Es necesario copiar el .env dentro y fuera del docker para la persistencia de datos


# APP


APP_NAME=threat-detection-api

ENVIRONMENT=development

DEBUG=True

LOG_LEVEL=INFO

 


# SERVER


HOST=0.0.0.0

PORT=8000

 


# DATABASE


DATABASE_URL=postgresql://admin:securepassword123@postgres:5432/threat_detection

POSTGRES_USER=admin
POSTGRES_PASSWORD=securepassword123
POSTGRES_DB=threat_detection

# Pool (importante más adelante)

DB_POOL_SIZE=10

DB_MAX_OVERFLOW=20

 

# Para implementar un docker para IA

AI_SERVICE_URL=http://localhost:8001

AI_TIMEOUT_SECONDS=3

 

# SEGURIDAD

SECRET_KEY=change-this-in-production

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30

 

# CORS

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081

 


# FILE STORAGE


UPLOAD_DIR=/app/uploads

AUDIO_UPLOAD_DIR=/app/uploads/audio

MAX_FILE_SIZE_MB=10

 


# GEO (PostGIS)


DEFAULT_RADIUS_METERS=1000

 


# FIREBASE (opcional)


FIREBASE_ENABLED=False

FIREBASE_CREDENTIALS_PATH=/app/firebase.json




# FEATURE FLAGS (control fino)


ENABLE_AI_FALLBACK=True

ENABLE_GEOLOCATION=True

ENABLE_NOTIFICATIONS=False


# ================================================================================
# DOCKER COMPOSE - THREAT DETECTION API COMPLETO
# ================================================================================
#
# Servicios:
# - PostgreSQL 16 con PostGIS (Base de datos)
# - FastAPI Backend (Aplicación)
#
# Uso:
#   docker-compose up -d        (Iniciar servicios)
#   docker-compose ps           (Ver estado)
#   docker-compose logs -f      (Ver logs)
#   docker-compose down         (Detener servicios)
#   docker-compose down -v      (Detener y eliminar volúmenes)
#   docker exec -it threat-db psql -U admin -d threat_detection
#   nos permite ver la base datos en la terminal
# ================================================================================
