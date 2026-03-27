#!/bin/bash

################################################################################
# THREAT DETECTION API - SCRIPT DE INICIO
################################################################################
#
# Uso:
#   bash start.sh          # Iniciar con Docker Compose
#   bash start.sh local    # Iniciar en local (Python)
#   bash start.sh stop     # Detener servicios
#   bash start.sh logs     # Ver logs
#
################################################################################

set -e  # Salir si hay error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Mensajes
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Variables
COMMAND="${1:-up}"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

################################################################################
# FUNCIONES
################################################################################

start_docker_compose() {
    log_info "🚀 Iniciando con Docker Compose..."
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker no está instalado"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose no está instalado"
        exit 1
    fi
    
    # Crear .env si no existe
    if [ ! -f "$PROJECT_DIR/.env" ]; then
        log_warning "Archivo .env no encontrado"
        log_info "Creando .env desde .env.example..."
        cp "$PROJECT_DIR/.env.example" "$PROJECT_DIR/.env"
        log_success "Archivo .env creado"
        log_warning "Por favor, edita .env con tus variables si es necesario"
    fi
    
    # Crear directorios
    mkdir -p "$PROJECT_DIR/uploads/audio" "$PROJECT_DIR/logs"
    log_success "Directorios creados"
    
    # Levantar servicios
    log_info "Levantando servicios con docker-compose..."
    cd "$PROJECT_DIR"
    docker-compose up -d
    
    # Esperar a que PostgreSQL esté listo
    log_info "Esperando a que PostgreSQL esté listo..."
    sleep 10
    
    # Verificar que los servicios estén corriendo
    if docker-compose ps | grep -q "postgres.*Up"; then
        log_success "PostgreSQL está corriendo"
    else
        log_error "PostgreSQL no inició correctamente"
        docker-compose logs postgres
        exit 1
    fi
    
    if docker-compose ps | grep -q "backend.*Up"; then
        log_success "Backend está corriendo"
    else
        log_error "Backend no inició correctamente"
        docker-compose logs backend
        exit 1
    fi
    
    # Inicializar BD
    log_info "Inicializando base de datos..."
    docker-compose exec -T backend python -c "from database.connection import init_db; init_db()" || true
    
    log_success "Servicios iniciados correctamente"
    echo ""
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}✓ API LISTA${NC}"
    echo -e "${GREEN}================================${NC}"
    echo -e "URL: ${BLUE}http://localhost:8000${NC}"
    echo -e "Docs: ${BLUE}http://localhost:8000/docs${NC}"
    echo -e "Status: ${BLUE}http://localhost:8000/health${NC}"
    echo -e "${GREEN}================================${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "1. Registrar usuario: curl -X POST http://localhost:8000/auth/register ..."
    echo "2. Ver logs: docker-compose logs -f backend"
    echo "3. Detener: docker-compose down"
    echo ""
}

start_local() {
    log_info "🚀 Iniciando en modo local (Python)..."
    
    # Verificar Python
    if ! command -v python3.11 &> /dev/null; then
        log_error "Python 3.11+ no está instalado"
        exit 1
    fi
    
    # Crear venv si no existe
    if [ ! -d "$PROJECT_DIR/venv" ]; then
        log_info "Creando entorno virtual..."
        python3.11 -m venv "$PROJECT_DIR/venv"
        log_success "Entorno virtual creado"
    fi
    
    # Activar venv
    log_info "Activando entorno virtual..."
    source "$PROJECT_DIR/venv/bin/activate"
    
    # Crear .env si no existe
    if [ ! -f "$PROJECT_DIR/.env" ]; then
        log_warning "Archivo .env no encontrado"
        cp "$PROJECT_DIR/.env.example" "$PROJECT_DIR/.env"
        log_success "Archivo .env creado"
        log_warning "Por favor, edita .env con tus variables"
    fi
    
    # Instalar dependencias
    log_info "Instalando dependencias..."
    pip install --upgrade pip > /dev/null 2>&1
    pip install -r "$PROJECT_DIR/requirements.txt" > /dev/null 2>&1
    log_success "Dependencias instaladas"
    
    # Crear directorios
    mkdir -p "$PROJECT_DIR/uploads/audio" "$PROJECT_DIR/logs"
    
    # Inicializar BD
    log_info "Inicializando base de datos..."
    python -c "from database.connection import init_db; init_db()" || true
    log_success "Base de datos inicializada"
    
    log_success "Iniciando servidor..."
    echo ""
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}✓ SERVIDOR INICIADO${NC}"
    echo -e "${GREEN}================================${NC}"
    echo -e "URL: ${BLUE}http://localhost:8000${NC}"
    echo -e "Docs: ${BLUE}http://localhost:8000/docs${NC}"
    echo -e "${GREEN}================================${NC}"
    echo ""
    
    # Ejecutar servidor
    cd "$PROJECT_DIR"
    python main.py
}

stop_services() {
    log_info "🛑 Deteniendo servicios..."
    
    if [ -f "$PROJECT_DIR/docker-compose.yml" ]; then
        cd "$PROJECT_DIR"
        docker-compose down
        log_success "Servicios detenidos"
    else
        log_error "docker-compose.yml no encontrado"
        exit 1
    fi
}

show_logs() {
    log_info "📊 Mostrando logs..."
    
    if [ -f "$PROJECT_DIR/docker-compose.yml" ]; then
        cd "$PROJECT_DIR"
        docker-compose logs -f backend
    else
        log_error "docker-compose.yml no encontrado"
        exit 1
    fi
}

show_status() {
    log_info "📈 Estado de servicios..."
    
    if [ -f "$PROJECT_DIR/docker-compose.yml" ]; then
        cd "$PROJECT_DIR"
        docker-compose ps
    else
        log_error "docker-compose.yml no encontrado"
        exit 1
    fi
}

test_api() {
    log_info "🧪 Probando API..."
    
    # Health check
    if curl -s http://localhost:8000/health | grep -q "ok"; then
        log_success "Health check: OK"
    else
        log_error "Health check: FAILED"
        return 1
    fi
    
    # Test registro
    log_info "Registrando usuario de prueba..."
    RESPONSE=$(curl -s -X POST http://localhost:8000/auth/register \
      -H "Content-Type: application/json" \
      -d '{
        "username": "testuser_'$(date +%s)'",
        "password": "test123456",
        "email": "test@example.com"
      }')
    
    if echo "$RESPONSE" | grep -q "uuid"; then
        log_success "Registro: OK"
    else
        log_error "Registro: FAILED"
        echo "$RESPONSE"
        return 1
    fi
    
    # Test análisis
    log_info "Probando análisis de riesgos..."
    RESPONSE=$(curl -s -X POST http://localhost:8000/analyze \
      -H "Content-Type: application/json" \
      -d '{"text": "si no pagas habrá consecuencias"}')
    
    if echo "$RESPONSE" | grep -q "HIGH"; then
        log_success "Análisis: OK (detectó HIGH risk)"
    else
        log_error "Análisis: FAILED"
        echo "$RESPONSE"
        return 1
    fi
    
    echo ""
    log_success "✓ Todos los tests pasaron"
}

show_help() {
    echo ""
    echo -e "${BLUE}Threat Detection API - Script de Inicio${NC}"
    echo ""
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos:"
    echo "  up                 Iniciar con Docker Compose (default)"
    echo "  local              Iniciar en local (Python)"
    echo "  stop               Detener servicios"
    echo "  logs               Ver logs en tiempo real"
    echo "  status             Ver estado de servicios"
    echo "  test               Probar endpoints"
    echo "  help               Mostrar este mensaje"
    echo ""
    echo "Ejemplos:"
    echo "  bash start.sh              # Inicia con Docker Compose"
    echo "  bash start.sh local        # Inicia en local"
    echo "  bash start.sh stop         # Detiene servicios"
    echo "  bash start.sh logs         # Ve logs"
    echo ""
}

################################################################################
# MAIN
################################################################################

case "$COMMAND" in
    up|start)
        start_docker_compose
        ;;
    local)
        start_local
        ;;
    stop)
        stop_services
        ;;
    logs)
        show_logs
        ;;
    status|ps)
        show_status
        ;;
    test)
        test_api
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "Comando desconocido: $COMMAND"
        show_help
        exit 1
        ;;
esac

exit 0
