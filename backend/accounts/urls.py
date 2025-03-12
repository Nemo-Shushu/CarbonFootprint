from django.urls import path
from accounts.views import (
    RegisterView,
    CsrfTokenView,
    LogoutView,
    LoginView,
    ConversionFactorsView,
    ConversionFactorsAPIView,
    ConfirmEmailAPIView,
    SendEmailConfirmationTokenAPIView,
    CreateView,
    UpdateView,
    UpdateUserEmailAPIView,
)

app_name = "accounts"

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("csrf/", CsrfTokenView.as_view(), name="csrf"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path(
        "conversion-factors/", ConversionFactorsView.as_view(), name="conversion-factor"
    ),
    path("conversion-factors/<int:factor_id>", ConversionFactorsAPIView.as_view()),
    path(
        "send-email-confirmation-token/",
        SendEmailConfirmationTokenAPIView.as_view(),
        name="send_email_confirmation_token",
    ),
    path("confirm-email/", ConfirmEmailAPIView.as_view(), name="confirm_email"),
    path("create-user/", CreateView.as_view(), name="confirm_user"),
    path('update/', UpdateView.as_view(), name='update'),
    path('update-email/', UpdateUserEmailAPIView.as_view(), name='update_email'),
]
