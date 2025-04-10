from django.urls import path
from accounts.views import (
    RegisterView,
    CsrfTokenView,
    LogoutView,
    LoginView,
    ConfirmEmailAPIView,
    SendEmailConfirmationTokenAPIView,
    CreateView,
    UpdateView,
    UpdateUserEmailAPIView,
    UpdateUserPasswordAPIView,
    CheckEmailAPIView,
    SendForgetPasswordConfirmationTokenAPIView,
    UserRetrieveView,
)

app_name = "accounts"

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("csrf/", CsrfTokenView.as_view(), name="csrf"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path(
        "send-email-confirmation-token/",
        SendEmailConfirmationTokenAPIView.as_view(),
        name="send_email_confirmation_token",
    ),
    path("confirm-email/", ConfirmEmailAPIView.as_view(), name="confirm_email"),
    path("create-user/", CreateView.as_view(), name="confirm_user"),
    path("update/", UpdateView.as_view(), name="update"),
    path("update-email/", UpdateUserEmailAPIView.as_view(), name="update_email"),
    path(
        "update-password/", UpdateUserPasswordAPIView.as_view(), name="update_password"
    ),
    path("check-email/", CheckEmailAPIView.as_view(), name="check_email"),
    path("forget-password/", SendForgetPasswordConfirmationTokenAPIView.as_view(), name="forget-password"),
    path("user/id/<int:pk>/", UserRetrieveView.as_view(), name="get-user-by-id"),
    path(
        "user/username/<str:username>/",
        UserRetrieveView.as_view(),
        name="get-user-by-username",
    ),
]
