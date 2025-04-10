import requests
import time

OPENWEATHER_API_KEY = "9a7c8fb9bb40f675d7bcac5dc96d58f9"
GOOGLE_API_KEY = "AIzaSyAlID_ZsPsuUgK7KaTGy7xacruoYgK7R3s"

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
