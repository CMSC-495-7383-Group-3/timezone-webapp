import json
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes

from .utils import (
    get_sunrise_sunset,
    get_timezone_info,
    get_time_info_by_timezone_name
)

class Time_Info(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        lat = request.GET.get("lat")
        lon = request.GET.get("lon")
        if not lat or not lon:
            return Response({"error": "Latitude and Longitude are required."},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            sunrise, sunset = get_sunrise_sunset(lat, lon)
            timezone_id, dst, offset = get_timezone_info(lat, lon)

            return Response({
                "sunrise": sunrise,
                "sunset": sunset,
                "timezone": timezone_id,
                "dstOffset": dst,
                "rawOffset": offset
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_time_info_by_timezone(request):
    tz_name = request.GET.get("timezone")

    if not tz_name:
        return Response({"error": "Missing 'timezone' parameter."}, status=400)

    try:
        data = get_time_info_by_timezone_name(tz_name)
        return Response(data)
    except ValueError as ve:
        return Response({"error": str(ve)}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
