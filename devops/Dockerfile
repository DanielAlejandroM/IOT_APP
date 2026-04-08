# DOCKERFILE - SAFEVOICE APP

# Imagen base
FROM python:3.11-slim

# variables de entorno
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# directorio de trabajo
WORKDIR /app


# dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# dependencias de python 

COPY backend/requirements.txt .

RUN pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt


    
# copia el backend del proyecto al contenedor
 
COPY backend/ .



# seguridad
# evita correr como root

RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

USER appuser


# puerto

EXPOSE 8000


# healthcheck

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1


# Start
#corrida del backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]