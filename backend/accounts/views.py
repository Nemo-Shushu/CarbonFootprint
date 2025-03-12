from rest_framework import generics, status, viewsets

from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny
from .models import User
from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated, IsAdminUser


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)  
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED, headers=headers
            )
        else:
            return Response(
                get_ordered_errors(serializer), status=status.HTTP_400_BAD_REQUEST
            )


class CsrfTokenView(APIView):
    permission_classes = (AllowAny,)

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, format=None):
        return Response({"detail": "CSRF cookie set"}, status=status.HTTP_200_OK)


class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return Response(
                {"detail": "Logged in successfully."}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED
            )


class LogoutView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        logout(request)
        return Response(
            {"detail": "Successfully logged out."}, status=status.HTTP_200_OK
        )

def get_ordered_errors(serializer):
    errors = serializer.errors
    ordered_errors = {}
    field_order = [
        "email",
        "username",
        "first_name",
        "last_name",
        "institute",
        "research_field",
        "password",
        "password2",
    ]

    for field in field_order:
        if field in errors:
            ordered_errors[field] = errors[field]

    for field, err in errors.items():
        if field not in ordered_errors:
            ordered_errors[field] = err

    return ordered_errors
