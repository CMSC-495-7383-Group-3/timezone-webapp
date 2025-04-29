import requests
import time
import os

# Load API keys from environment variables
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Mini map of timezone names to coordinates
TIMEZONE_COORDS = {
    "Europe/Berlin": {"lat": 52.52, "lon": 13.405},
    "Europe/London": (51.5072, -0.1276),
    "Australia/Sydney": (-33.8688, 151.2093),
    "Asia/Tokyo": {"lat": 35.6895, "lon": 139.6917},
    "America/New_York": {"lat": 40.7128, "lon": -74.0060},
    "America/Los_Angeles": {"lat": 34.0522, "lon": -118.2437},
    "UTC": {"lat": 0, "lon": 0},
    # Add more if needed
}

def get_sunrise_sunset(lat, lon):
    if not OPENWEATHER_API_KEY:
        raise Exception("Missing OpenWeather API key.")

    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}"
    response = requests.get(url)
    data = response.json()

    # Optional: add error handling for unexpected responses
    if "sys" not in data:
        raise Exception("Failed to retrieve sunrise/sunset data from OpenWeather.")

    return data["sys"]["sunrise"], data["sys"]["sunset"]

def get_timezone_info(lat, lon):
    if not GOOGLE_API_KEY:
        raise Exception("Missing Google API key.")

    timestamp = int(time.time())
    url = f"https://maps.googleapis.com/maps/api/timezone/json?location={lat},{lon}&timestamp={timestamp}&key={GOOGLE_API_KEY}"
    response = requests.get(url)
    data = response.json()

    if "timeZoneId" not in data:
        raise Exception("Failed to retrieve timezone info from Google API.")

    return data["timeZoneId"], data["dstOffset"], data["rawOffset"]

def get_time_info_by_timezone_name(tz_name):
    if tz_name not in TIMEZONE_COORDS:
        raise ValueError("Unknown timezone name.")

    coords = TIMEZONE_COORDS[tz_name]
    lat, lon = coords["lat"], coords["lon"]

    sunrise, sunset = get_sunrise_sunset(lat, lon)
    timezone_id, dst_offset, raw_offset = get_timezone_info(lat, lon)


    return {
        "timezone_id": timezone_id,
        "dst_offset": dst_offset,
        "raw_offset": raw_offset,
        "sunrise": sunrise,
        "sunset": sunset
    }
