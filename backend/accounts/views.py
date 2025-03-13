from rest_framework import generics, status, viewsets

from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny
from .models import User, ConversionFactor,EmailVerification
from .serializers import RegisterSerializer, UserSerializer, ConversionFactorsSerializer,CreateUserSerializer
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from django.core.mail import EmailMessage
from django.utils.crypto import get_random_string

class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class RegisterView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            return Response({"message": "User Detail verified successfully."}, status=status.HTTP_200_OK)
        else:
            errors = get_ordered_errors(serializer)
            print(errors)
            return Response(
                errors, status=status.HTTP_400_BAD_REQUEST
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


class ConversionFactorsView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, format=None):
        queryset = ConversionFactor.objects.all().order_by("activity")
        serializer = ConversionFactorsSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ConversionFactorsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# view used to update specific conversion factor
class ConversionFactorsAPIView(APIView):
    permission_classes = (IsAdminUser,)

    def get_object(self, factor_id):
        try:
            return ConversionFactor.objects.get(pk=factor_id)
        except ConversionFactor.DoesNotExist:
            return None
        except ConversionFactor.MultipleObjectsReturned:
            return None

    def get(self, request, factor_id, format=None):
        factor_instance = self.get_object(factor_id)
        if not factor_instance:
            return Response(
                {
                    "res": f"Object with factor id {factor_id} does not exist {IsAdminUser}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = ConversionFactorsSerializer(factor_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, factor_id, format=None):
        factor = self.get_object(factor_id)
        serializer = ConversionFactorsSerializer(factor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, factor_id):
        factor_instance = self.get_object(factor_id)
        if not factor_instance:
            return Response(
                {"res": "Object with factor id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        factor_instance.delete()
        return Response({"res": "Object deleted!"}, status=status.HTTP_200_OK)


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
    permission_classes = [AllowAny,]
    def post(self, request, format=None):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
        code = get_random_string(length=6)

        EmailVerification.objects.update_or_create(email = email, defaults={"verification_code": code})

        send_verification_email(email, code)
        return Response({"message": "Verification code sent."}, status=status.HTTP_200_OK)
    
class ConfirmEmailAPIView(APIView):
    permission_classes = [AllowAny,]
    def post(self, request):
        email = request.data.get("email")
        code = request.data.get("verification_code")
        if not email or not code:
            return Response({"error": "Email and verification code are required."}, status=status.HTTP_400_BAD_REQUEST)

        verification_obj = get_object_or_404(EmailVerification, emil=email)
        if verification_obj.verification_code == code:
            user = verification_obj.user
            user.is_verified = True
            user.save()
            verification_obj.delete() 
            return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid verification code."}, status=status.HTTP_400_BAD_REQUEST)
        
class CreateView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = CreateUserSerializer

    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
        