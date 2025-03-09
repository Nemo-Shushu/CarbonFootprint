from django.test import SimpleTestCase, RequestFactory
from unittest.mock import patch
from django.contrib.sessions.middleware import SessionMiddleware
from django.contrib.auth import authenticate
from api.views import get_csrf, login_view, logout_view
import json
from django.test import SimpleTestCase, RequestFactory
from unittest.mock import patch, MagicMock


# ---- CSRF Test ----
class CSRFTokenTests(SimpleTestCase):

    def setUp(self):
        self.factory = RequestFactory()

    def test_get_csrf_token_directly(self):
        """Test get_csrf """
        request = self.factory.get('/fake-url/')
        response = get_csrf(request)

        self.assertEqual(response.status_code, 200)
        self.assertIn('X-CSRFToken', response.headers)
        self.assertTrue(response.headers['X-CSRFToken'])

# ---- Login test ----
class LoginTests(SimpleTestCase):

    def setUp(self):
        self.factory = RequestFactory()

    def mock_session(self):
        session = MagicMock()
        session.cycle_key = MagicMock()
        session.flush = MagicMock()
        return session

    def mock_user(self):
        mock_user = MagicMock()
        mock_user.is_authenticated = True
        mock_user._meta = MagicMock()
        mock_user._meta.pk.value_to_string = MagicMock(return_value='mock_user_id')
        mock_user.backend = 'django.contrib.auth.backends.ModelBackend'
        return mock_user

    @patch('api.views.authenticate')
    @patch('django.contrib.auth.login')
    def test_login_view_success(self, mock_login, mock_authenticate):
        """Test login success"""
        mock_authenticate.return_value = self.mock_user()
        mock_login.return_value = None

        request = self.factory.post('/fake-url/', content_type='application/json',
                                    data=json.dumps({'username': 'testuser', 'password': 'testpassword'}))
        request.session = self.mock_session()

        response = login_view(request)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {'detail': 'Successfully logged in.'})

    @patch('api.views.authenticate')
    def test_login_view_invalid_credentials(self, mock_authenticate):
        """Test invaild username and password"""
        mock_authenticate.return_value = None

        request = self.factory.post('/fake-url/', content_type='application/json',
                                    data=json.dumps({'username': 'testuser', 'password': 'wrongpassword'}))
        request.session = self.mock_session()

        response = login_view(request)
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {'detail': 'Invalid credentials.'})

    def test_login_view_missing_fields(self):
        """Test miss password when login"""
        request = self.factory.post('/fake-url/', content_type='application/json',
                                    data=json.dumps({'username': 'testuser'}))
        request.session = self.mock_session()

        response = login_view(request)
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {'detail': 'Please provide username and password.'})

    @patch('django.contrib.auth.logout')
    def test_logout_view_success(self, mock_logout):
        """Test logout success"""
        mock_logout.return_value = None

        request = self.factory.get('/fake-url/')
        request.session = self.mock_session()
        request.user = type('User', (), {'is_authenticated': True})

        response = logout_view(request)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {'detail': 'Successfully logged out.'})

    def test_logout_view_not_logged_in(self):
        """Test logout when you are not logged in"""
        request = self.factory.get('/fake-url/')
        request.session = self.mock_session()
        request.user = type('User', (), {'is_authenticated': False})

        response = logout_view(request)
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {'detail': 'You\'re not logged in.'})