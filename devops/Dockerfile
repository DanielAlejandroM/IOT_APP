# ================================================================================
# DOCKERFILE - THREAT DETECTION API BACKEND (FINAL)
# ================================================================================

FROM python:3.11-slim

# ==============================
# Configuración base
# ==============================
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# ==============================
# Dependencias del sistema
# ==============================
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# ==============================
# Dependencias Python
# ==============================
COPY backend/requirements.txt .

RUN pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

# ==============================
# Código de la app
# ==============================
COPY backend/ .

# ==============================
# Seguridad
# ==============================
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

USER appuser

# ==============================
# Puerto
# ==============================
EXPOSE 8000

# ==============================
# Healthcheck
# ==============================
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# ==============================
# Start
# ==============================
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]