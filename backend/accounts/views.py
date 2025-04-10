from rest_framework import generics, status

from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import User, EmailVerification
from .serializers import (
    RegisterSerializer,
    CreateUserSerializer,
    UpdateSerializer,
    UserSerializer,
)
from django.contrib.auth import authenticate, login, logout
from django.core.mail import EmailMessage
from django.utils.crypto import get_random_string
from django.shortcuts import get_object_or_404
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


class RegisterView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            return Response(
                {"message": "User Detail verified successfully."},
                status=status.HTTP_200_OK,
            )
        else:
            errors = get_ordered_errors(serializer)
            print(errors)
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)


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


def send_verification_email(email, code):
    subject = "Your Verification Code"
    body = f"Your verification code is: {code}"
    email_message = EmailMessage(subject, body, to=[email])
    email_message.send()


class SendEmailConfirmationTokenAPIView(APIView):
    permission_classes = [
        AllowAny,
    ]

    def post(self, request, format=None):
        email = request.data.get("email")
        code = get_random_string(length=6)
        
        try:
            user = User.objects.get(email=email)
            print(user)
        except User.DoesNotExist:
            EmailVerification.objects.update_or_create(
            email=email, defaults={"verification_code": code})
            send_verification_email(email, code)
            return Response(
                {"message": "Verification code sent."}, status=status.HTTP_200_OK
            )
        return Response(
                {"error": "A user with this email exists in the database."},
                status=status.HTTP_404_NOT_FOUND,
            )
    
class SendForgetPasswordConfirmationTokenAPIView(APIView):
    permission_classes = [
        AllowAny,
    ]

    def post(self, request, format=None):
        email = request.data.get('email')
        print(email)
        if not email:
            return Response(
                {"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST
            )
        try:
            user = User.objects.get(email=email)
            print(user)
        except User.DoesNotExist:
            return Response(
                {"error": "Email does not exist in the database."},
                status=status.HTTP_404_NOT_FOUND,
            )
        code = get_random_string(length=6)

        EmailVerification.objects.update_or_create(
            email=email, defaults={"verification_code": code}
        )

        send_verification_email(email, code)
        return Response(
            {"message": "Verification code sent."}, status=status.HTTP_200_OK
        )



class ConfirmEmailAPIView(APIView):
    permission_classes = [
        AllowAny,
    ]

    def post(self, request):
        if "user" in request.data and request.data["user"]:
            user_data = request.data.get("user")
            email = user_data.get("email")
        else:
            email = request.data.get("email")

        code = request.data.get("verification_code")
        if not email or not code:
            return Response(
                {"error": "Email and verification code are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            verification_obj = EmailVerification.objects.get(email=email)
        except EmailVerification.DoesNotExist:
            return Response(
                {"detail": "Email already verified or no verification record found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if verification_obj.verification_code == code:
            verification_obj.delete()
            return Response(
                {"message": "Email verified successfully."}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "Invalid verification code."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CreateView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = CreateUserSerializer

    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = UpdateSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateUserEmailAPIView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, format=None):
        current_email = request.data.get("currentEmail")
        new_email = request.data.get("newEmail")

        if not current_email or not new_email:
            return Response(
                {"error": "Both current_email and new_email are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email=new_email).exists():
            return Response(
                {"error": "A user with the new email already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = get_object_or_404(User, email=current_email)
        user.email = new_email
        user.save()

        return Response(
            {"message": "Email updated successfully."}, status=status.HTTP_200_OK
        )


class UpdateUserPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, format=None):
        current_email = request.data.get("email")
        password = request.data.get("password")

        if not current_email:
            return Response(
                {"error": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=current_email)
        except User.DoesNotExist:
            return Response(
                {"error": "User with the provided email does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )
        try:
            validate_password(password, user)
        except ValidationError as e:
            return Response(
                {"error": e.messages},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.set_password(password)
        user.save()

        return Response(
            {"message": "Password updated successfully."}, status=status.HTTP_200_OK
        )


class CheckEmailAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        current_email = request.data.get("email")
        
        
        
        if not current_email:
            return Response(
                {"error": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=current_email)
            if user:
                return Response(
                    {"message": "User with the provided email does exist "},
                    status=status.HTTP_200_OK,
                )
        except User.DoesNotExist:
            return Response(
                {"error": "User with the provided email does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )


# Retrieve a user by ID or username
class UserRetrieveView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def retrieve(self, request, *args, **kwargs):
        user_id = kwargs.get("pk")
        username = kwargs.get("username")

        user = None
        if user_id:
            user = User.objects.filter(id=user_id).first()
        elif username:
            user = User.objects.filter(username=username).first()

        if not user:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
