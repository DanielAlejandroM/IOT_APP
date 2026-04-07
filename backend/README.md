# SAFEVOICE — Backend API

Sistema de detección acústica comunitaria. Backend REST con FastAPI, PostgreSQL + PostGIS y autenticación JWT.

---

## Tabla de contenidos

1. [Stack tecnológico](#stack-tecnológico)
2. [Estructura del proyecto](#estructura-del-proyecto)
3. [Requisitos previos](#requisitos-previos)
4. [Configuración de variables de entorno](#configuración-de-variables-de-entorno)
5. [Levantar con Docker](#levantar-con-docker)
6. [Endpoints disponibles](#endpoints-disponibles)
7. [Migraciones con Alembic](#migraciones-con-alembic)
8. [Desarrollo local](#desarrollo-local)
9. [Modelos de base de datos](#modelos-de-base-de-datos)
10. [Equipo](#equipo)

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | FastAPI 0.104+ |
| Servidor ASGI | Uvicorn (con hot-reload en dev) |
| Base de datos | PostgreSQL 16 + PostGIS 3.4 |
| ORM | SQLAlchemy 2.0 |
| Migraciones | Alembic 1.13 |
| Autenticación | JWT (python-jose) + Bcrypt (passlib) |
| Validación | Pydantic v2 |
| Contenedores | Docker + Docker Compose |
| Geoespacial | GeoAlchemy2 + Shapely |

---

## Estructura del proyecto

```
backend/
├── main.py                  # Entry point — registra routers y crea tablas
├── config.py                # Variables de entorno (SECRET_KEY, JWT config)
├── requirements.txt         # Dependencias Python
│
├── database/
│   └── connection.py        # Engine SQLAlchemy + SessionLocal + Base
│
├── models/
│   ├── database.py          # Modelos SQLAlchemy (User, Alert)
│   └── schemas.py           # Schemas Pydantic (request/response)
│
├── routes/
│   ├── auth.py              # Endpoints de autenticación + get_current_user
│   └── alerts.py            # Endpoints de alertas
│
├── services/
│   ├── auth_service.py      # Lógica de negocio: crear usuario, JWT, bcrypt
│   └── alert_service.py     # Lógica de negocio: crear alerta
│
├── utils/
│   └── logger.py            # Configuración de logging
│
├── alembic/                 # Migraciones de base de datos
│   ├── env.py
│   ├── script.py.mako
│   └── versions/            # Archivos de migración generados
│
├── alembic.ini              # Configuración de Alembic
├── firebase.json            # Credenciales Firebase (no commitear)
└── logs/                    # Logs de la aplicación
```

```
devops/
├── Dockerfile               # Multi-stage build para la API
├── docker-compose.yml       # Orquestación: postgres + backend
└── postgres_data/           # Volumen local de PostgreSQL (gitignored)
```

---

## Requisitos previos

- Docker Desktop instalado y corriendo
- Puerto `5432` y `8000` libres en tu máquina

---

## Configuración de variables de entorno

Crea el archivo `devops/.env` basándote en este template:

```env
# Base de datos
POSTGRES_USER=admin
POSTGRES_PASSWORD=securepassword123
POSTGRES_DB=safevoice
DATABASE_URL=postgresql://admin:securepassword123@postgres:5432/safevoice

# JWT
SECRET_KEY=tu-clave-secreta-cambia-en-produccion
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# App
DEBUG=True
LOG_LEVEL=INFO
```

> **Importante:** nunca commitees el archivo `.env` real. El `.env` de `devops/` es leído directamente por Docker Compose.

---

## Levantar con Docker

```bash
# Entrar a la carpeta devops
cd devops

# Primera vez o después de cambios en Dockerfile/requirements.txt
docker-compose up --build -d

# Uso normal (sin rebuild)
docker-compose up -d

# Ver estado de los contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f backend

# Detener servicios
docker-compose down

# Detener y eliminar base de datos (reset completo)
docker-compose down -v
rm -rf postgres_data
```

Una vez levantado, la API está disponible en:
- API: `http://localhost:8000`
- Docs Swagger: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

---

## Endpoints disponibles

### Auth

| Método | Endpoint | Descripción | Auth requerida |
|--------|----------|-------------|----------------|
| POST | `/auth/register` | Registrar nuevo usuario | No |
| POST | `/auth/login` | Login — devuelve JWT | No |
| GET | `/auth/me` | Perfil del usuario actual | Sí |

#### POST `/auth/register`
```json
{
  "email": "usuario@example.com",
  "password": "minimo6chars",
  "usuario": "Nombre Apellido"
}
```

#### POST `/auth/login`
```json
{
  "email": "usuario@example.com",
  "password": "minimo6chars"
}
```
Respuesta:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

---

### Alertas

| Método | Endpoint | Descripción | Auth requerida |
|--------|----------|-------------|----------------|
| POST | `/alerts` | Crear nueva alerta acústica | Sí |
| GET | `/alerts/nearby` | Alertas cercanas (ST_DWithin) | Sí — pendiente |
| POST | `/alerts/{id}/respond` | Confirmar apoyo comunitario | Sí — pendiente |

#### POST `/alerts`

Header: `Authorization: Bearer <token>`

```json
{
  "event_type": "panic_button",
  "alert_type": "rojo/naranja",
  "lat": -0.1807,
  "lng": -78.4678
}
```

---

### Sistema

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check básico |

---

## Migraciones con Alembic

Alembic gestiona los cambios de esquema sin necesidad de hacer `docker-compose down -v`.

```bash
# Entrar al contenedor
docker exec -it threat-api bash

# Generar migración automática después de cambiar models/database.py
alembic revision --autogenerate -m "descripcion del cambio"

# Aplicar migraciones pendientes
alembic upgrade head

# Ver historial de migraciones
alembic history

# Revertir la última migración
alembic downgrade -1
```

### Flujo típico para agregar una columna

1. Editar `models/database.py` y agregar la columna al modelo:
```python
fcm_token = Column(String, nullable=True)
```

2. Generar y aplicar desde el contenedor:
```bash
alembic revision --autogenerate -m "add fcm_token to users"
alembic upgrade head
```

3. El cambio se aplica en caliente — sin perder datos.

---

## Desarrollo local

El volumen de Docker mapea `../backend:/app`, por lo que cualquier cambio guardado en VS Code se refleja inmediatamente en el contenedor. Uvicorn corre con `--reload`, así que el servidor se reinicia automáticamente.

No necesitas rebuild para cambios en el código Python. Solo necesitas rebuild cuando:
- Cambias `requirements.txt` (nuevas dependencias)
- Cambias el `Dockerfile`

---

## Modelos de base de datos

### User

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Integer PK | Identificador único |
| email | String UNIQUE | Email del usuario |
| password_hash | String | Hash bcrypt de la contraseña |
| usuario | String | Nombre del usuario |
| created_at | DateTime | Fecha de registro |
| is_active | Boolean | Estado de la cuenta |

### Alert

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Integer PK | Identificador único |
| event_type | String | Tipo de evento (ej. panic_button) |
| alert_type | String | Nivel de alerta (ej. rojo/naranja) |
| lat | Float | Latitud del evento |
| lng | Float | Longitud del evento |
| timestamp | DateTime | Momento del evento |
| user_id | Integer FK | Usuario que creó la alerta |

---

## Equipo

| Nombre | Rol |
|--------|-----|
| Johanna Gutiérrez | Mobile Developer |
| Christian Miranda | Backend Developer |
| Francisco Jaramillo | Mobile Developer |
| Daniel Morocho | DevOps & Infrastructure |
| Katherine Muñoz | IA Developer |

**Supervisor:** Ing. Diego Franz — Universidad Central del Ecuador

---

*SAFEVOICE v0.1.0 MVP — Abril 2026*