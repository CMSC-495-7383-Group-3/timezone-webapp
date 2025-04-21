import json
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import get_sunrise_sunset, get_timezone_info

class Time_Info(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        lat = request.GET.get("lat")
        lon = request.GET.get("lon")
        if not lat or not lon:
            return Response(json.loads(json.dumps({"error": "Latitude and Longitude are required."})), 
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            sunrise, sunset = get_sunrise_sunset(lat, lon)
            timezone_id, dst, offset = get_timezone_info(lat, lon)

            return Response(
                json.loads(json.dumps({
                    "sunrise": sunrise,
                    "sunset": sunset,
                    "timezone": timezone_id,
                    "dstOffset": dst,
                    "rawOffset": offset
                })),
            status=status.HTTP_200_OK)
        except Exception as e:
            return Response(json.loads(json.dumps({"error": str(e)})), 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

