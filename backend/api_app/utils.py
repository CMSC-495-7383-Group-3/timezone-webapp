import requests
import time
import os

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


def get_sunrise_sunset(lat, lon):
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}"
    response = requests.get(url)
    data = response.json()
    return data["sys"]["sunrise"], data["sys"]["sunset"]

def get_timezone_info(lat, lon):
    timestamp = int(time.time())
    url = f"https://maps.googleapis.com/maps/api/timezone/json?location={lat},{lon}&timestamp={timestamp}&key={GOOGLE_API_KEY}"
    response = requests.get(url)
    data = response.json()
    return data["timeZoneId"], data["dstOffset"], data["rawOffset"]
