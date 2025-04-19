#!/bin/bash

# Script to set up development environment for Django + React app without Docker
# Supports Linux, macOS, and Windows

set -euo pipefail

# Colors for output
RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m'

# Logging setup
LOG_DIR="logs"
LOG_FILE="$LOG_DIR/dev_setup.log"

mkdir -p "$LOG_DIR"
touch "$LOG_FILE"

log_message() {
  local level="$1"
  local message="$2"
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  case "$level" in
    info)
      echo "[$timestamp] $GREEN[INFO]$NC $message" | tee -a "$LOG_FILE"
      ;;
    warning)
      echo "[$timestamp] $YELLOW[WARNING]$NC $message" | tee -a "$LOG_FILE"
      ;;
    error)
      echo "[$timestamp] $RED[ERROR]$NC $message" >&2 | tee -a "$LOG_FILE"; exit 1;
      ;;
  esac
}

# Function to detect OS
detect_os() {
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "linux"
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "macos"
  elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$(uname -s)" == "MINGW"* ]]; then
    echo "windows"
  else
    log_message "error" "Unsupported OS: $OSTYPE"
    exit 1
  fi
}

OS=$(detect_os)
log_message "info" "Detected OS: $OS"

# Install dependencies based on OS
install dependencies() {
  if [ "$OS" == "linux" ]; then
    log_message "info" "Installing dependencies for Linux..."
    sudo apt-get update >> "$LOG_FILE" 2>&1 || {
      log_message "error" "Failed to update package list"
      exit 1
    }
    sudo apt-get install -y python3 python3-pip python3-venv nodejs npm postgresql postgresql-contrib >> "$LOG_FILE" 2>&1 || {
      log_message "error" "Failed to install dependencies"
      exit 1
    }
  elif [ "$OS" == "macos" ]; then
    log_message "info" "installing dependencies for macOS..."
    brew install python node postgresql >> "$LOG_FILE" 2>&1 || {
      log_message "error" "Failed to install dependencies"
      exit 1
    }
  elif [ "$OS" == "windows" ]; then
    log_message "info" "Installed dependencies for Windows..."
    if command -v winget &> /dev/null; then
      winget install -e --id Python.Python.3.11 Node.js PostgreSQL.PostgreSQL >> "$LOG_FILE" 2>&1 || {
        log_message "error" "Failed to install dependencies with winget"
        exit 1
      }
    else 
      log_message "error" "winget not found. Please install Python, Node.js, and PostgreSQL manually."
      exit 1
    fi
  fi
  log_message "info" "Dependencies installed successfully"
}

# Check and install dependencies
check_dependencies() {
  if ! command -v python3 &> /dev/null || ! command -v node &> /dev/null || ! command -v psql &> /dev/null; then
    log_message "info" "Some dependencies missing. Installing..."
    install_dependencies
  else
    log_message "info" "All dependencies already installed"
  fi
}

# Set up PostgreSQL user and database
setup_postgres() {
  log_message "info" "Setting up PostgreSQL..."
  if [ "$OS" == "linux" ]; then
    sudo -u postgres psql -c "CREATE DATABASE tz_db;" >> "$LOG_FILE" 2>&1 || log_message "warning" "Database tz_db already exists"
    sudo -u postgres psql -c "CREATE USER tz_user WITH PASSWORD 'tz_password';" >> "$LOG_FILE" 2>&1 || log_message "warning" "User tz_user already exists"
    sudo -u postgres psql -c "ALTER ROLE tz_user SET client_encoding TO 'utf8';" >> "$LOG_FILE" 2>&1
    sudo -u postgres psql -c "ALTER ROLE tz_user SET default_transaction_isolation TO 'read committed';" >> "$LOG_FILE" 2>&1
    sudo -u postgres psql -c "ALTER ROLE tz_user SET timezone TO 'UTC';" >> "$LOG_FILE" 2>&1
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE tz_db TO tz_user;" >> "$LOG_FILE" 2>&1
  elif [ "$OS" == "macos" ]; then
    psql -c "CREATE DATABASE tz_db;" >> "$LOG_FILE" 2>&1 || log_message "warning" "Database tz_db already exists"
    psql -c "CREATE USER tz_user WITH PASSWORD 'tz_password';" >> "$LOG_FILE" 2>&1 || log_message "warning" "User tz_user already exists"
    psql -c "ALTER ROLE tz_user SET client_encoding TO 'utf8';" >> "$LOG_FILE" 2>&1
    psql -c "ALTER ROLE tz_user SET default_transaction_isolation TO 'read committed';" >> "$LOG_FILE" 2>&1
    psql -c "ALTER ROLE tz_user SET timezone TO 'UTC';" >> "$LOG_FILE" 2>&1
    psql -c "GRANT ALL PRIVILEGES ON DATABASE tz_db TO tz_user;" >> "$LOG_FILE" 2>&1
  elif [ "$OS" == "windows" ]; then
    psql -U postgres -c "CREATE DATABASE tz_db;" >> "$LOG_FILE" 2>&1 || log_message "warning" "Database tz_db already exists"
    psql -U postgres -c "CREATE USER tz_user WITH PASSWORD 'tz_password';" >> "$LOG_FILE" 2>&1 || log_message "warning" "User tz_user already exists"
    psql -U postgres -c "ALTER ROLE tz_user SET client_encoding TO 'utf8';" >> "$LOG_FILE" 2>&1
    psql -U postgres -c "ALTER ROLE tz_user SET default_transaction_isolation TO 'read committed';" >> "$LOG_FILE" 2>&1
    psql -U postgres -c "ALTER ROLE tz_user SET timezone TO 'UTC';" >> "$LOG_FILE" 2>&1
    psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE tz_db TO tz_user;" >> "$LOG_FILE" 2>&1
  fi
  log_message "info" "PostgreSQL setup complete"
}

# Set up Python virtual environment and install dependencies
setup_python() {
  log_message "info" "Setting up Python environment..."
  cd backend
  if [ "$OS" == "windows" ]; then
    python -m venv .venv
    source .venv/Scripts/activate
  else
    python3 -m venv .venv
    source .venv/bin/activate
  fi
  pip install --upgrade pip >> "$LOG_FILE" 2>&1 || {
    log_message "error" "Failed to upgrade pip"
    exit 1
  }
  pip install -r requirements.txt >> "$LOG_FILE" 2>&1 || {
    log_message "error" "Failed to install Python dependencies"
    exit 1
  }
  deactivate
  cd ..
  log_message "info" "Python environment setup complete"
}

# Set up Node.js dependencies
setup_node() {
  log_message "info" "Setting up Node.js environment..."
  cd frontend
  npm install >> "$LOG_FILE" 2>&1 || {
    log_message "error" "Failed to install Node.js dependencies"
    exit 1
  }
  cd ..
  log_message "info" "Node.js environment setup complete."
}

# Run development servers
run_servers() {
  log_message "info" "Starting development servers..."
  cd backend
  if [ "$OS" == "windows" ]; then
    source .venv/Scripts/activate
  else
    source venv/bin/activate
  fi
  python manage.py migrate >> "$LOG_FILE" 2>&1 || {
    log_message "error" "Failed to run Django migrations"
    exit 1
  }
  if [ "$OS" == "windows" ]; then
    start cmd /c "python manage.py runserver 0.0.0.0:8000 >> $LOG_DIR/django.log 2>&1"
  else
    python manage.py runserver 0.0.0.0:8000 >> "$LOG_DIR/django.log" 2>&1 &
    DJANGO_PID=$!
  fi
  deactivate
  cd ..

  cd frontend
  if [ "$OS" == "windows" ]; then
    start cmd /c "npm run dev >> $LOG_DIR/react.log 2>&1"
  else
    npm run dev >> "$LOG_DIR/react.log" 2>&1 &
    REACT_PID=$!
  fi
  cd ..

  if [ "$OS" != "windows" ]; then
    trap "kill $DJANGO_PID $REACT_PID 2>/dev/null; log_message 'info' 'Development servers stopped'; exit" INT TERM EXIT
  fi

  log_message "info" "Development servers started: Backend at http://localhost:8000, Frontend at http://localhost:5173" 
  if [ "$OS" == "windows" ]; then
    log_message "info" "Servers running in separate windows. Close them to stop."
    wait
  else
    wait
  fi
}

# Main execution
log_message "info" "Starting development environment..."
check_dependencies
setup_postgres
setup_python
setup_node
run_servers
