"""This module defines the views that handle HTTP requests and route them appropriately."""

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, LoginSerializer


class RegisterView(generics.CreateAPIView):
    """This view is a public endpoint for user creation.

    This endpoint does not log the User in, however, and a separate login request
    with the User's credentials must be made.
    """
    permission_classes = [AllowAny]
    serializer_class = UserSerializer


class LoginView(APIView):
    """This view authenticates users and returns tokens and user data.

    The `access` token returned in the response is the Authorization header
    token, and should be passed back and forth between the client and server
    as "Authorization: Bearer *access_token*".

    The `refresh` token returned in the response is the Refresh token that must
    be maintained with the User as well during their session. This token can be
    stored with the User in the client, and used to either refresh the User's
    access token at `api/v1/users/token/refresh/` or used to logout at
    `api/v1/users/logout/`.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """This method is the appropriate POST request handler."""
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = authenticate(email=email, password=password)
        if not user:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)


class ProfileView(generics.RetrieveUpdateAPIView):
    """"This view allows authenticated users to view and update their profile."""
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class LogoutView(APIView):
    """This view blacklists refresh tokens for secure logout."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """This method is the appropriate POST request handler.

        Users must include the `refresh` token from the original login
        response to successfully blacklist the token.
        """
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
