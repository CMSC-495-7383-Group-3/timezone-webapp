#!/bin/bash

# Script to set up development environment for Django + React app without Docker
# Supports Linux, macOS, and Windows

set -uo pipefail

# Colors for output
RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m'

# Logging setup
LOG_DIR="$(pwd)/logs"
LOG_FILE="$LOG_DIR/dev_setup.log"
DJANGO_LOG="$LOG_DIR/django.log"
REACT_LOG="$LOG_DIR/react.log"

# Ensure log directory and files exist
mkdir -p "$LOG_DIR" || {
  echo "Failed to create log directory $LOG_DIR" >&2
  exit 1
}
touch "$LOG_FILE" "$DJANGO_LOG" "$REACT_LOG" || {
  echo "Failed to create log files in $LOG_DIR" >&2
  exit 1
}
chmod -R u+rw "$LOG_DIR" || {
  echo "Failed to set permissions for $LOG_DIR" >&2
  exit 1
}

log_message() {
  local level="$1"
  local message="$2"
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  local output
  case "$level" in
    info)
      output="[$timestamp] $GREEN[INFO]$NC $message"
      ;;
    warning)
      output="[$timestamp] $YELLOW[WARNING]$NC $message"
      ;;
    error)
      output="[$timestamp] $RED[ERROR]$NC $message"
      echo "$output" >&2
      echo "$output" >> "$LOG_FILE" 2>/dev/null || echo "Failed to write to $LOG_FILE" >&2
      exit 1
      ;;
  esac
  echo "$output" | tee -a "$LOG_FILE" 2>/dev/null || echo "Warning: Failed to write to $LOG_FILE" >&2
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
  fi
}

OS=$(detect_os)
log_message "info" "Detected OS: $OS"

# Install dependencies based on OS
install_dependencies() {
  if [ "$OS" == "linux" ]; then
    log_message "info" "Installing dependencies for Linux..."
    sudo apt-get update >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to update package list"
    sudo apt-get install -y python3 python3-pip python3-venv npm postgresql postgresql-contrib >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to install dependencies"
    sudo npm install -g n >> "$LOG_FILE" 2>&1 || log_message "warning" "Failed to install n from npm; continuing with existing Node.js"
    sudo n stable >> "$LOG_FILE" 2&>1 || log_message "warning" "Failed to install Node.js stable; continuing with existing version"
  elif [ "$OS" == "macos" ]; then
    log_message "info" "installing dependencies for macOS..."
    brew install python npm postgresql >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to install dependencies"
    sudo npm install -g n >> "$LOG_FILE" 2>&1 || log_message "warning" "Failed to install n from npm; continuing with existing Node.js"
    sudo n stable >> "$LOG_FILE" 2&>1 || log_message "warning" "Failed to install Node.js stable; continuing with existing version"
  elif [ "$OS" == "windows" ]; then
    log_message "info" "Installed dependencies for Windows..."
    if command -v winget &> /dev/null; then
      winget install -e --id Python.Python.3.11 Node.js PostgreSQL.PostgreSQL >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to install dependencies with winget"
    else 
      log_message "error" "winget not found. Please install Python, Node.js, and PostgreSQL manually."
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
  if [ "$OS" != "windows" ]; then
    sudo systemctl enable postgresql >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to enable postgresql"
    sudo systemctl restart postgresql >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to restart postgresql"
  fi
  if [ "$OS" == "linux" ]; then
    sudo -u postgres psql -c "CREATE DATABASE tz_db;" >> "$LOG_FILE" 2>&1 || log_message "warning" "Database tz_db already exists"
    sudo -u postgres psql -c "CREATE USER tz_user WITH PASSWORD 'tz_password';" >> "$LOG_FILE" 2>&1 || log_message "warning" "User tz_user already exists"
    sudo -u postgres psql -c "ALTER ROLE tz_user SET client_encoding TO 'utf8';" >> "$LOG_FILE" 2>&1
    sudo -u postgres psql -c "ALTER ROLE tz_user SET default_transaction_isolation TO 'read committed';" >> "$LOG_FILE" 2>&1
    sudo -u postgres psql -c "ALTER ROLE tz_user SET timezone TO 'UTC';" >> "$LOG_FILE" 2>&1
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE tz_db TO tz_user;" >> "$LOG_FILE" 2>&1
    sudo -u postgres psql -d tz_db -c "GRANT USAGE, CREATE ON SCHEMA public TO tz_user;" >> "$LOG_FILE" 2>&1 || log_message "warning" "Schema permissions already granted"
  elif [ "$OS" == "macos" ]; then
    psql -c "CREATE DATABASE tz_db;" >> "$LOG_FILE" 2>&1 || log_message "warning" "Database tz_db already exists"
    psql -c "CREATE USER tz_user WITH PASSWORD 'tz_password';" >> "$LOG_FILE" 2>&1 || log_message "warning" "User tz_user already exists"
    psql -c "ALTER ROLE tz_user SET client_encoding TO 'utf8';" >> "$LOG_FILE" 2>&1
    psql -c "ALTER ROLE tz_user SET default_transaction_isolation TO 'read committed';" >> "$LOG_FILE" 2>&1
    psql -c "ALTER ROLE tz_user SET timezone TO 'UTC';" >> "$LOG_FILE" 2>&1
    psql -c "GRANT ALL PRIVILEGES ON DATABASE tz_db TO tz_user;" >> "$LOG_FILE" 2>&1
    psql -d tz_db -c "GRANT USAGE, CREATE ON SCHEMA public TO tz_user;" >> "$LOG_FILE" 2>&1 || log_message "warning" "Schema permissions already granted"
  elif [ "$OS" == "windows" ]; then
    psql -U postgres -c "CREATE DATABASE tz_db;" >> "$LOG_FILE" 2>&1 || log_message "warning" "Database tz_db already exists"
    psql -U postgres -c "CREATE USER tz_user WITH PASSWORD 'tz_password';" >> "$LOG_FILE" 2>&1 || log_message "warning" "User tz_user already exists"
    psql -U postgres -c "ALTER ROLE tz_user SET client_encoding TO 'utf8';" >> "$LOG_FILE" 2>&1
    psql -U postgres -c "ALTER ROLE tz_user SET default_transaction_isolation TO 'read committed';" >> "$LOG_FILE" 2>&1
    psql -U postgres -c "ALTER ROLE tz_user SET timezone TO 'UTC';" >> "$LOG_FILE" 2>&1
    psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE tz_db TO tz_user;" >> "$LOG_FILE" 2>&1
    psql -U postgres -d tz_db -c "GRANT USAGE, CREATE ON SCHEMA public TO tz_user;" >> "$LOG_FILE" 2>&1 || log_message "warning" "Schema permissions already granted"
  fi
  log_message "info" "PostgreSQL setup complete"
}

# Set up Python virtual environment and install dependencies
setup_python() {
  log_message "info" "Setting up Python environment..."
  cd backend || log_message "error" "Failed to change to backend directory"
  if [ "$OS" == "windows" ]; then
    python -m venv .venv
    source .venv/Scripts/activate
  else
    python3 -m venv .venv
    source .venv/bin/activate
  fi
  pip install --upgrade pip >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to upgrade pip"
  pip install -r requirements.txt >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to install Python dependencies"
  deactivate
  cd .. || log_message "error" "Failed to return to project root directory"
  log_message "info" "Python environment setup complete"
}

# Set up Node.js dependencies
setup_node() {
  log_message "info" "Setting up Node.js environment..."
  cd frontend || log_message "error" "Failed to change to frontend directory"
  npm install >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to install Node.js dependencies"
  cd .. || log_message "error" "Failed to return to project root directory"
  log_message "info" "Node.js environment setup complete."
}

# Run development servers
run_servers() {
  log_message "info" "Starting development servers..."
  cd backend || log_message "error" "Failed to change to backend directory"
  if [ "$OS" == "windows" ]; then
    source .venv/Scripts/activate
  else
    source .venv/bin/activate
  fi
  python manage.py migrate >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to run Django migrations"
  if [ "$OS" == "windows" ]; then
    start cmd /c "python manage.py runserver 0.0.0.0:8000 >> $DJANGO_LOG 2>&1"
  else
    python manage.py runserver 0.0.0.0:8000 >> "$DJANGO_LOG" 2>&1 &
    DJANGO_PID=$!
  fi
  deactivate
  cd ../frontend || log_message "error" "Failed to change to frontend directory"
  if [ "$OS" == "windows" ]; then
    start cmd /c "npm run dev >> $REACT_LOG 2>&1"
  else
    npm run dev >> $REACT_LOG 2>&1 &
    REACT_PID=$!
  fi
  cd .. || log_message "error" "Failed to return to project root directory"
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
