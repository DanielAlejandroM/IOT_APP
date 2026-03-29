# ================================================================================
# DOCKERFILE - THREAT DETECTION API BACKEND
# ================================================================================
#
# Build: docker build -t threat-detection-api:1.0.0 .
# Run: docker run -p 8000:8000 threat-detection-api:1.0.0
#
# ================================================================================

# Imagen base: Python 3.11 slim (100MB vs 900MB full)
FROM python:3.11-slim

# Metadata
LABEL maintainer="Christian Miranda crmirandazambrano@gmail.com"
LABEL version="1.0.0"
LABEL description="Threat Detection API - Audio/Text Risk Analysis"

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements
COPY requirements.txt .

# Instalar dependencias Python
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiar código de la aplicación
COPY . .

# Crear directorio de uploads
RUN mkdir -p uploads/audio logs

# Usuario no-root para seguridad
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

USER appuser

# Puerto que expone
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')" || exit 1

# Comando de inicio
CMD ["python", "main.py"]

# ================================================================================
# NOTAS:
# ================================================================================
#
# Construir imagen:
#   docker build -t threat-detection-api:1.0.0 .
#
# Ejecutar localmente:
#   docker run \
#     -p 8000:8000 \
#     -e DATABASE_URL=postgresql://admin:pass@host:5432/threat_detection \
#     -e SECRET_KEY=tu-clave-secreta \
#     threat-detection-api:1.0.0
#
# Con docker-compose:
#   docker-compose up -d
#
# Ver logs:
#   docker logs threat-api
#
# Ejecutar comando dentro del contenedor:
#   docker exec threat-api python -c "from database.connection import init_db; init_db()"
#
# ================================================================================
