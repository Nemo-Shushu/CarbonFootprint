import json
from django.test import SimpleTestCase, RequestFactory
from unittest.mock import patch, MagicMock
from rest_framework import status
from rest_framework.test import APIRequestFactory
from accounts.views import (
    RegisterView,
    CsrfTokenView,
    LoginView,
    LogoutView,
    get_ordered_errors,
)
from django.middleware.csrf import CsrfViewMiddleware
from accounts.models import EmailVerification
from accounts.views import (
    SendEmailConfirmationTokenAPIView,
    ConfirmEmailAPIView,
    CreateView,
    UpdateUserEmailAPIView,
)


class RegisterViewTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("accounts.serializers.RegisterSerializer.is_valid", return_value=True)
    def test_register_success(self, mock_is_valid):
        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True

        with patch("accounts.views.get_ordered_errors", return_value={}):
            with patch(
                "accounts.views.RegisterSerializer", return_value=mock_serializer
            ):
                request = self.factory.post(
                    "/register/",
                    data={
                        "username": "testuser",
                        "email": "test@example.com",
                        "password": "securepassword",
                    },
                    content_type="application/json",
                )

                response = RegisterView.as_view()(request)
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                self.assertEqual(
                    response.data, {"message": "User Detail verified successfully."}
                )

    @patch("accounts.serializers.RegisterSerializer.is_valid", return_value=False)
    def test_register_failure(self, mock_is_valid):
        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = False

        with patch(
            "accounts.views.get_ordered_errors", return_value={"error": "Invalid data"}
        ):
            with patch(
                "accounts.views.RegisterSerializer", return_value=mock_serializer
            ):
                request = self.factory.post(
                    "/register/",
                    data={
                        "username": "testuser",
                        "email": "invalid-email",
                        "password": "short",
                    },
                    content_type="application/json",
                )

                response = RegisterView.as_view()(request)
                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
                self.assertEqual(response.data, {"error": "Invalid data"})


class CsrfTokenViewTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_csrf_token_set_success(self):
        request = self.factory.get("/csrf-token/")

        middleware = CsrfViewMiddleware(lambda req: CsrfTokenView.as_view()(req))
        response = middleware(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data, {"detail": "CSRF cookie set"})

        self.assertIn("csrftoken", response.cookies)

        self.assertIn(response.cookies["csrftoken"]["secure"], [True, False])


class LoginLogoutTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("accounts.views.authenticate")
    @patch("accounts.views.login")
    def test_login_success(self, mock_login, mock_authenticate):
        mock_authenticate.return_value = MagicMock()
        mock_login.return_value = None

        request = self.factory.post(
            "/login/",
            {"username": "testuser", "password": "correctpassword"},
            content_type="application/json",
        )

        response = LoginView.as_view()(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"detail": "Logged in successfully."})

    @patch("accounts.views.authenticate")
    def test_login_invalid_credentials(self, mock_authenticate):
        mock_authenticate.return_value = None

        request = self.factory.post(
            "/login/",
            {"username": "testuser", "password": "wrongpassword"},
            content_type="application/json",
        )

        response = LoginView.as_view()(request)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {"detail": "Invalid credentials."})

    def test_login_missing_fields(self):
        request = self.factory.post(
            "/login/", {"username": "testuser"}, content_type="application/json"
        )

        response = LoginView.as_view()(request)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {"detail": "Invalid credentials."})

    @patch("accounts.views.logout")
    def test_logout_success(self, mock_logout):
        mock_logout.return_value = None

        request = self.factory.post("/logout/", content_type="application/json")

        response = LogoutView.as_view()(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"detail": "Successfully logged out."})

    @patch("accounts.views.logout")
    def test_logout_not_logged_in(self, mock_logout):
        mock_logout.return_value = None

        request = self.factory.post("/logout/", content_type="application/json")

        response = LogoutView.as_view()(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"detail": "Successfully logged out."})


class MockFactory:
    @staticmethod
    def mock_user():
        mock_user = MagicMock()
        mock_user.is_authenticated = True
        return mock_user


class GetOrderedErrorsTests(SimpleTestCase):
    def setUp(self):
        self.mock_serializer = MagicMock()

    def test_full_field_ordering(self):
        self.mock_serializer.errors = {
            "password": ["This field is required."],
            "email": ["Invalid email."],
            "research_field": ["This field is empty."],
            "username": ["Username is too short."],
            "password2": ["Passwords do not match."],
        }

        expected_output = {
            "email": ["Invalid email."],
            "username": ["Username is too short."],
            "research_field": ["This field is empty."],
            "password": ["This field is required."],
            "password2": ["Passwords do not match."],
        }

        self.assertEqual(get_ordered_errors(self.mock_serializer), expected_output)

    def test_partial_field_ordering(self):
        self.mock_serializer.errors = {
            "username": ["Username is required."],
            "password": ["Weak password."],
        }

        expected_output = {
            "username": ["Username is required."],
            "password": ["Weak password."],
        }

        self.assertEqual(get_ordered_errors(self.mock_serializer), expected_output)

    def test_non_standard_fields(self):
        self.mock_serializer.errors = {
            "custom_field": ["This is a custom error."],
            "password": ["Weak password."],
        }

        expected_output = {
            "password": ["Weak password."],
            "custom_field": ["This is a custom error."],
        }

        self.assertEqual(get_ordered_errors(self.mock_serializer), expected_output)

    def test_empty_errors(self):
        self.mock_serializer.errors = {}

        expected_output = {}
        self.assertEqual(get_ordered_errors(self.mock_serializer), expected_output)


class SendEmailConfirmationTokenAPIViewTests(SimpleTestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    @patch("accounts.models.EmailVerification.objects.filter")
    @patch("accounts.models.EmailVerification.objects.update_or_create")
    @patch("accounts.views.send_verification_email")
    def test_send_verification_token_success(
        self, mock_send_email, mock_update_or_create, mock_filter
    ):
        mock_filter.return_value.count.return_value = 0
        mock_update_or_create.return_value = (MagicMock(), True)

        request = self.factory.post(
            "/send-email-confirmation-token/",
            json.dumps({"email": "test@university.ac.uk"}),
            content_type="application/json",
        )

        response = SendEmailConfirmationTokenAPIView.as_view()(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"message": "Verification code sent."})

    @patch("accounts.models.EmailVerification.objects.filter")
    def test_send_verification_token_duplicate_email(self, mock_filter):
        mock_filter.return_value.count.return_value = 2

        request = self.factory.post(
            "/send-email-confirmation-token/",
            json.dumps({"email": "duplicate@university.ac.uk"}),
            content_type="application/json",
        )

        response = SendEmailConfirmationTokenAPIView.as_view()(request)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data, {"error": "Email is not unique in the database."}
        )


class ConfirmEmailAPIViewTests(SimpleTestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    @patch("accounts.models.EmailVerification.objects.get")
    def test_confirm_email_success(self, mock_get):
        mock_verification = MagicMock(verification_code="123456")
        mock_get.return_value = mock_verification

        request = self.factory.post(
            "/confirm-email/",
            json.dumps(
                {"email": "test@university.ac.uk", "verification_code": "123456"}
            ),
            content_type="application/json",
        )

        response = ConfirmEmailAPIView.as_view()(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"message": "Email verified successfully."})

    @patch(
        "accounts.models.EmailVerification.objects.get",
        side_effect=EmailVerification.DoesNotExist,
    )
    def test_confirm_email_not_found(self, mock_get):
        request = self.factory.post(
            "/confirm-email/",
            json.dumps(
                {"email": "notfound@university.ac.uk", "verification_code": "123456"}
            ),
            content_type="application/json",
        )

        response = ConfirmEmailAPIView.as_view()(request)
        self.assertEqual(response.status_code, 404)

    @patch("accounts.models.EmailVerification.objects.get")
    def test_confirm_email_invalid_code(self, mock_get):
        mock_verification = MagicMock(verification_code="654321")
        mock_get.return_value = mock_verification

        request = self.factory.post(
            "/confirm-email/",
            json.dumps(
                {"email": "test@university.ac.uk", "verification_code": "123456"}
            ),
            content_type="application/json",
        )

        response = ConfirmEmailAPIView.as_view()(request)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {"error": "Invalid verification code."})


class CreateViewTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("accounts.views.CreateView.get_serializer")
    def test_create_user_success(self, mock_get_serializer):
        mock_serializer_instance = MagicMock()
        mock_serializer_instance.is_valid.return_value = True
        mock_serializer_instance.data = {
            "username": "newuser",
            "email": "newuser@university.ac.uk",
        }

        mock_serializer_instance.save = MagicMock()

        mock_get_serializer.return_value = mock_serializer_instance

        request = self.factory.post(
            "/create-user/",
            {
                "username": "newuser",
                "email": "newuser@university.ac.uk",
                "password": "securepassword",
                "password2": "securepassword",
            },
            content_type="application/json",
        )

        response = CreateView.as_view()(request)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            response.data, {"username": "newuser", "email": "newuser@university.ac.uk"}
        )

    @patch("accounts.views.CreateView.get_serializer")
    def test_create_user_failure_invalid_data(self, mock_get_serializer):
        mock_serializer_instance = MagicMock()
        mock_serializer_instance.is_valid.return_value = False
        mock_serializer_instance.errors = {"username": ["Invalid username."]}

        mock_get_serializer.return_value = mock_serializer_instance

        request = self.factory.post(
            "/create-user/",
            {
                "username": "invaliduser",
                "email": "invalid-email",
                "password": "securepassword",
                "password2": "securepassword",
            },
            content_type="application/json",
        )

        response = CreateView.as_view()(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"username": ["Invalid username."]})

    @patch("accounts.views.CreateView.get_serializer")
    def test_create_user_missing_fields(self, mock_get_serializer):
        mock_serializer_instance = MagicMock()
        mock_serializer_instance.is_valid.return_value = False
        mock_serializer_instance.errors = {"password": ["This field is required."]}

        mock_get_serializer.return_value = mock_serializer_instance

        request = self.factory.post(
            "/create-user/",
            {"username": "userwithnopassword", "email": "user@university.ac.uk"},
            content_type="application/json",
        )

        response = CreateView.as_view()(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"password": ["This field is required."]})


class UpdateUserEmailAPIViewTests(SimpleTestCase):

    def setUp(self):
        self.factory = RequestFactory()

    @patch("accounts.views.get_object_or_404")
    @patch("accounts.views.User.objects.filter")
    def test_update_user_email_success(self, mock_user_filter, mock_get_object):
        mock_user_filter.return_value.exists.return_value = False
        mock_user = MagicMock()
        mock_get_object.return_value = mock_user

        request = self.factory.patch(
            "/update-user-email/",
            {"currentEmail": "existing@example.com", "newEmail": "newuser@example.com"},
            content_type="application/json"
        )

        response = UpdateUserEmailAPIView.as_view()(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "Email updated successfully."})
        mock_user.save.assert_called_once()

    @patch("accounts.views.User.objects.filter")
    def test_update_user_email_already_exists(self, mock_user_filter):
        mock_user_filter.return_value.exists.return_value = True

        request = self.factory.patch(
            "/update-user-email/",
            {"currentEmail": "existing@example.com", "newEmail": "newuser@example.com"},
            content_type="application/json"
        )

        response = UpdateUserEmailAPIView.as_view()(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"error": "A user with the new email already exists."})