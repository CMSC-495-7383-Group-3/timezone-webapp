from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .utils import get_sunrise_sunset, get_timezone_info

@api_view(["GET"])
@permission_classes([IsAuthenticated])  # only logged in users can access
def get_time_info(request):
    lat = request.GET.get("lat")
    lon = request.GET.get("lon")

    if not lat or not lon:
        return Response({"error": "Latitude and Longitude are required."}, status=400)

    try:
        sunrise, sunset = get_sunrise_sunset(lat, lon)
        timezone_id, dst, offset = get_timezone_info(lat, lon)

        return Response({
            "sunrise": sunrise,
            "sunset": sunset,
            "timezone": timezone_id,
            "dstOffset": dst,
            "rawOffset": offset
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)
