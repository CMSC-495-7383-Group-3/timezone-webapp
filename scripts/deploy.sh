#!/bin/bash

# Script to deploy Django + React app in production

set -uo pipefail

# Colors for output
RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m'

# Configuration
DOMAIN="timezone-webapp.duckdns.org"
EMAIL="thomas.childress02@gmail.com"
PROJECT_DIR="/opt/timezone-webapp"
DJANGO_DIR="$PROJECT_DIR/backend"
REACT_DIR="$PROJECT_DIR/frontend"
VENV_DIR="$DJANGO_DIR/.venv"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/prod_deploy.log"
REPO_DIR="$(pwd)" # Assuming the script is being run from the repo root
USER=$(whoami)

# Logging setup
mkdir -p "$LOG_DIR" || {
  echo "Failed to create log directory $LOG_DIR" >&2
  exit 1
}
touch "$LOG_FILE" || {
  echo "Failed to create log file $LOG_FILE" >&2
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

# Install system dependencies (Ubuntu)
install_system_deps() {
  log_message "info" "Installing system dependencies..."
  sudo apt-get update >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to update package list"
  sudo apt-get install -y python3 python3-pip python3-venv npm nginx certbot python3-certbot-nginx postgresql postgresql-contrib gunicorn >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to install system dependencies"
  sudo npm install -g n >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to install n from npm"
  sudo n stable >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to install Node.js"
  log_message "info" "System dependencies installed successfully"
}

# Check PostgreSQL connectivity
check_postgres() {
  log_message "info" "Checking PostgreSQL connectivity..."
  psql -U tz_user -d tz_db -h localhost -c "SELECT 1;" >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to connect to tz_db as tz_user. Ensure PostgreSQL is running and tz_user/tz_password are correct."
  log_message "info" "PostgreSQL connectivity verified"
}

# Set up PostgreSQL
setup_postgres() {
    log_message "info" "Setting up PostgreSQL..."
    sudo -u postgres psql -c "CREATE DATABASE tz_db;" >> "$LOG_FILE" 2>&1 || log_message "warning" "Database tz_db already exists"
    # Change PASSWORD in EC2 instance
    sudo -u postgres psql -c "CREATE USER tz_user WITH PASSWORD 'tz_password';" >> "$LOG_FILE" 2>&1 || log_message "warning" "User tz_user already exists"
    sudo -u postgres psql -c "ALTER ROLE tz_user SET client_encoding TO 'utf8';" >> "$LOG_FILE" 2>&1
    sudo -u postgres psql -c "ALTER ROLE tz_user SET default_transaction_isolation TO 'read committed';" >> "$LOG_FILE" 2>&1
    sudo -u postgres psql -c "ALTER ROLE tz_user SET timezone TO 'UTC';" >> "$LOG_FILE" 2>&1
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE tz_db TO tz_user;" >> "$LOG_FILE" 2>&1
    sudo -u postgres psql -d tz_db -c "GRANT USAGE, CREATE ON SCHEMA public TO tz_user;" >> "$LOG_FILE" 2>&1 || log_message "warning" "Schema permissions already granted"
    log_message "info" "PostgreSQL setup complete"
}

# Set up project directory and virtual environment
setup_project() {
  log_message "info" "Setting up project directory and virtual environment..."
  sudo mkdir -p "$PROJECT_DIR" || log_message "error" "Failed to create project directory $PROJECT_DIR"
  sudo chown "$USER:$USER" "$PROJECT_DIR"
  python3 -m venv "$VENV_DIR" >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to create virtual environment"
  source "$VENV_DIR/bin/activate"
  pip install --upgrade pip >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to upgrade pip"
  if [ -f "$DJANGO_DIR/requirements.txt" ]; then
    pip install -r "$DJANGO_DIR/requirements.txt" >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to install Python dependencies"
  else
    pip install django djangorestframework djangorestframework_simplejwt django-cors-headers psycopg2-binary gunicorn requests >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to install default Python dependencies"
  fi
  deactivate
  log_message "info" "Project directory and virtual environment setup complete"
}

# Configure Django
configure_django() {
  log_message "info" "Configuring Django..."
  cd "$DJANGO_DIR" || log_message "error" "Failed to change to Django directory"
  source "$VENV_DIR/bin/activate"
  python manage.py migrate >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to run Django migrations"
  python manage.py collectstatic --noinput >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to collect static files"
  deactivate
  cd "$PROJECT_DIR" || log_message "error" "Failed to return to project directory"
  log_message "info" "Django configuration complete"
}

# Set up Gunicorn systemd service
setup_gunicorn() {
  log_message "info" "Setting up Gunicorn..."
  if [ ! -f "$REPO_DIR/systemd/gunicorn.service" ]; then
    log_message "error" "Gunicorn config file $REPO_DIR/systemd/gunicorn.service not found"
  fi
  envsubst '\${USER} \${DJANGO_DIR} \${VENV_DIR}' < "$REPO_DIR/systemd/gunicorn.service" | sudo tee /etc/systemd/system/gunicorn.service > /dev/null || log_message "error" "Failed to write Gunicorn service file"
  sudo systemctl enable gunicorn >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to enable Gunicorn service"
  sudo systemctl start gunicorn >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to start Gunicorn service"
  log_message "info" "Gunicorn setup complete"
}

# Build and collect React static files
build_react() {
  log_message "info" "Building React frontend..."
  mkdir -p "$REACT_DIR" || log_message "error" "Failed to create React directory"
  cd "$REACT_DIR" || log_message "error" "Failed to change to React directory"
  npm install >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to install Node.js dependencies"
  npm run build >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to build React app"
  sudo mkdir -p /opt/timezone-webapp/static || log_message "error" "Failed to create static directory"
  sudo cp -r dist/* /opt/timezone-webapp/static >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to copy React build files"
  cd "$PROJECT_DIR" || log_message "error" "Failed to return to project directory"
  log_message "info" "React frontend build complete"
}

# Configure Nginx
configure_nginx() {
  log_message "info" "Configuring Nginx..."
  if [ ! -f "$REPO_DIR/fileserver/nginx.conf" ]; then
    log_message "error" "Nginx config file $REPO_DIR/fileserver/nginx.conf not found"
  fi
  envsubst '\${DOMAIN}' < "$REPO_DIR/fileserver/nginx.conf" | sudo tee /etc/nginx/sites-available/timezone-webapp > /dev/null || log_message "error" "Failed to write Nginx config file"
  sudo ln -sf /etc/nginx/sites-available/timezone-webapp /etc/nginx/sites-enabled/ >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to enable Nginx site"
  sudo nginx -t >> "$LOG_FILE" 2>&1 || log_message "error" "Nginx configuration test failed"
  sudo systemctl restart nginx >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to restart Nginx"
  log_message "info" "Nginx configuration complete"
}

# Set up Let's Encrypt
setup_letsencrypt() {
  log_message "info" "Setting up Let's Encrypt..."
  sudo certbot --nginx -d "$DOMAIN" --email "$EMAIL" --agree-tos --non-interactive >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to set up Let's Encrypt"
  sudo systemctl restart nginx >> "$LOG_FILE" 2>&1 || log_message "error" "Failed to restart Nginx after Let's Encrypt"
  log_message "info" "Let's encrypt setup complete"
}

# Main execution
log_message "info" "Starting production deployment..."
install_system_deps
setup_postgres
check_postgres
setup_project
configure_django
setup_gunicorn
build_react
configure_nginx
setup_letsencrypt
log_message "info" "Production deployment complete. Application available at https://$DOMAIN"
