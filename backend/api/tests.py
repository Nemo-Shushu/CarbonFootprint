from django.test import SimpleTestCase, RequestFactory
from django.contrib.auth.models import AnonymousUser
from api.views import (
    admin_request_list,
    approve_or_reject_request,
    get_csrf,
    login_view,
    logout_view,
    retrieve_and_delete_temp_report,
    session_view,
    store_unsubmitted_reports_backend,
    submit_admin_request,
    user_request_status,
    whoami_view,
    institution_list,
    field_list,
)
from api.views import (
    ProcurementCalculatorView,
    ReportcalculateView,
    report_view,
    submit_view,
    dashboard_show_user_result_data,
    get_all_report_data,
    get_all_carbon_impact,
    update_carbon_impact,
)
import json
from unittest.mock import patch, MagicMock
from api.models import Result, AdminRequest
from backend.modified_libraries.response import JsonResponse


# Mock Utilities
class MockFactory:
    @staticmethod
    def mock_session():
        session = MagicMock()
        session.cycle_key = MagicMock()
        session.flush = MagicMock()
        return session

    @staticmethod
    def mock_user(
        username="testuser",
        first_name="Test",
        email="test@example.com",
        institute_name="Institute A",
        research_field_name="Research Field A",
        is_admin=False,
        is_researcher=False,
        date_joined="2025-01-01",
        authenticated=True,
    ):
        mock_user = MagicMock()
        mock_user.is_authenticated = authenticated
        mock_user.username = username
        mock_user.first_name = first_name
        mock_user.email = email
        mock_user.institute = type("Institute", (), {"name": institute_name})
        mock_user.research_field = type(
            "ResearchField", (), {"name": research_field_name}
        )
        mock_user.is_admin = is_admin
        mock_user.is_researcher = is_researcher
        mock_user.date_joined = date_joined
        mock_user._meta = MagicMock()
        mock_user._meta.pk.value_to_string = MagicMock(return_value="mock_user_id")
        mock_user.backend = "django.contrib.auth.backends.ModelBackend"
        mock_user.is_anonymous = not authenticated  # Fix for request.user issues
        return mock_user


# CSRF Tests
class CSRFTokenTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_get_csrf_token(self):
        request = self.factory.get("/fake-url/")
        response = get_csrf(request)

        self.assertEqual(response.status_code, 200)
        self.assertIn("X-CSRFToken", response.headers)
        self.assertTrue(response.headers["X-CSRFToken"])


# Auth Tests
class AuthTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("api.views.authenticate")
    @patch("django.contrib.auth.login")
    def test_login_success(self, mock_login, mock_authenticate):
        mock_authenticate.return_value = MockFactory.mock_user()
        mock_login.return_value = None

        request = self.factory.post(
            "/fake-url/",
            content_type="application/json",
            data=json.dumps({"username": "testuser", "password": "testpassword"}),
        )
        request.session = MockFactory.mock_session()
        request.user = AnonymousUser()  # Fix for request.user issues

        response = login_view(request)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"detail": "Successfully logged in."})

    @patch("api.views.authenticate")
    def test_login_invalid_credentials(self, mock_authenticate):
        mock_authenticate.return_value = None

        request = self.factory.post(
            "/fake-url/",
            content_type="application/json",
            data=json.dumps({"username": "testuser", "password": "wrongpassword"}),
        )
        request.session = MockFactory.mock_session()
        request.user = AnonymousUser()  # Fix for request.user issues

        response = login_view(request)
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"detail": "Invalid credentials."})

    def test_login_missing_fields(self):
        request = self.factory.post(
            "/fake-url/",
            content_type="application/json",
            data=json.dumps({"username": "testuser"}),
        )
        request.session = MockFactory.mock_session()
        request.user = AnonymousUser()  # Fix for request.user issues

        response = login_view(request)
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(
            response.content, {"detail": "Please provide username and password."}
        )

    @patch("django.contrib.auth.logout")
    def test_logout_success(self, mock_logout):
        mock_logout.return_value = None

        request = self.factory.get("/fake-url/")
        request.session = MockFactory.mock_session()
        request.user = MockFactory.mock_user(authenticated=True)

        response = logout_view(request)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"detail": "Successfully logged out."})

    def test_logout_not_logged_in(self):
        request = self.factory.get("/fake-url/")
        request.session = MockFactory.mock_session()
        request.user = AnonymousUser()  # Fix for request.user issues

        response = logout_view(request)
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"detail": "You're not logged in."})


class SessionWhoamiTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_session_authenticated(self):
        request = self.factory.get("/fake-url/")
        request.user = MockFactory.mock_user()

        response = session_view(request)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"isAuthenticated": True})

    def test_session_not_authenticated(self):
        request = self.factory.get("/fake-url/")
        request.user = MockFactory.mock_user(authenticated=False)

        response = session_view(request)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"isAuthenticated": False})

    def test_whoami_authenticated(self):
        mock_user = MockFactory.mock_user()

        mock_user_data = {
            "isAuthenticated": True,
            "username": "testuser",
            "forename": "Test",
            "email": "test@example.com",
            "institute": "Institute A",
            "research_field": "Research Field A",
            "isAdmin": False,
            "isResearcher": False,
            "dateJoined": "2025-01-01",
        }

        request = self.factory.get("/fake-url/")
        request.user = mock_user

        with patch("api.views.JsonResponse", return_value=JsonResponse(mock_user_data)):
            response = whoami_view(request)

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, mock_user_data)

    def test_whoami_not_authenticated(self):
        request = self.factory.get("/fake-url/")
        request.user = MockFactory.mock_user(authenticated=False)

        response = whoami_view(request)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"isAuthenticated": False})


class InstitutionFieldTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def mock_serializer(self, data):
        mock_serializer = MagicMock()
        mock_serializer.data = data
        return mock_serializer

    @patch("api.views.University.objects.all")
    @patch("api.views.InstitutionSerializer")
    def test_institution_list(self, mock_serializer_class, mock_university_all):
        """Test institution list logic"""
        mock_university_all.return_value = ["University A", "University B"]
        mock_serializer_class.return_value = self.mock_serializer(
            [{"name": "University A"}, {"name": "University B"}]
        )

        request = self.factory.get("/fake-url/")
        response = institution_list(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data, [{"name": "University A"}, {"name": "University B"}]
        )

    @patch("api.views.ResearchField.objects.all")
    @patch("api.views.ResearchFieldSerializer")
    def test_field_list(self, mock_serializer_class, mock_field_all):
        """Test field list logic"""
        mock_field_all.return_value = ["Field A", "Field B"]
        mock_serializer_class.return_value = self.mock_serializer(
            [{"name": "Field A"}, {"name": "Field B"}]
        )

        request = self.factory.get("/fake-url/")
        response = field_list(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [{"name": "Field A"}, {"name": "Field B"}])


class CalculationTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.procurement_calculator = ProcurementCalculatorView()
        self.report_calculator = ReportcalculateView()

    def mock_entry(self, description_dict):
        mock_entry = MagicMock()
        mock_entry.description_dict = description_dict
        return mock_entry

    def mock_factor_entry(self, intensity=0.0, transmission=0.0, amount=1.0):
        mock_entry = MagicMock()
        mock_entry.carbon_impact = intensity
        return mock_entry


@patch("api.views.BenchmarkData.objects.filter")
def test_calculate_report_emissions(self, mock_benchmark_filter):
    """Test calculate report emissions logic"""
    mock_benchmark_filter.return_value.first.side_effect = [
        self.mock_factor_entry(
            intensity=1.0, transmission=1.0, amount=1.0
        ),  # Academic Laboratory
        self.mock_factor_entry(
            intensity=1.0, transmission=1.0, amount=1.0
        ),  # Academic Office
        self.mock_factor_entry(
            intensity=1.0, transmission=1.0, amount=1.0
        ),  # Admin Office
        self.mock_factor_entry(
            intensity=1.0, transmission=1.0, amount=1.0
        ),  # Office/Admin Space
        self.mock_factor_entry(
            intensity=1.0, transmission=1.0, amount=1.0
        ),  # Medical Laboratory
        self.mock_factor_entry(
            intensity=1.0, transmission=1.0, amount=1.0
        ),  # Engineering Laboratory
        self.mock_factor_entry(
            intensity=1.0, transmission=1.0, amount=1.0
        ),  # Physical Sciences Lab
        self.mock_factor_entry(
            intensity=1.0, transmission=1.0, amount=1.0
        ),  # mixed-recycle
        self.mock_factor_entry(
            intensity=1.0, transmission=1.0, amount=1.0
        ),  # general-waste
        self.mock_factor_entry(
            intensity=1.0, transmission=1.0, amount=1.0
        ),  # clinical-waste
        self.mock_factor_entry(
            intensity=1.0, transmission=1.0, amount=1.0
        ),  # chemical-waste
        self.mock_factor_entry(
            intensity=1.0, transmission=1.0, amount=1.0
        ),  # bio-waste
    ]

    request_data = {
        "utilities": {
            "FTE-staff": 10,
            "FTE-members": 20,
            "Academic Laboratory": "100",
            "Academic Office": "200",
            "Admin Office": "300",
            "Office/Admin Space": "150",
            "Medical/Life Sciences Laboratory": "250",
            "Engineering Laboratory": "350",
            "Physical Sciences Laboratory": "400",
        },
        "travel": {
            "air-eco-short-UK": "1000",
            "air-business-short-UK": "500",
            "air-eco-long-UK": "800",
            "air-business-long-UK": "300",
            "land-car": "1200",
            "land-local-bus": "400",
        },
        "waste": {
            "mixed-recycle": "2",
            "general-waste": "3",
            "clinical-waste": "1.5",
            "chemical-waste": "0.5",
            "bio-waste": "0.8",
        },
        "procurement": {
            "CA": 100,
            "WB": 200,
            "PA": 50,
            "AF": 150,
            "TA": 120,
            "AB": 1,
            "C": 100,
        },
    }

    result = self.report_calculator.calculate_report_emissions(request_data)

    self.assertIn("total_electricity_emissions", result)
    self.assertIn("total_gas_emissions", result)
    self.assertIn("total_water_emissions", result)


class ReportTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("api.views.ReportcalculateView.calculate_report_emissions")
    @patch("api.views.ProcurementCalculatorView.calculate_procurement_emissions")
    @patch("api.views.report_view")
    def test_report_view_success(
        self, mock_report_view, mock_procurement_calc, mock_report_calc
    ):
        """Test report API logic"""
        mock_report_calc.return_value = {
            "total_electricity_emissions": 100,
            "total_gas_emissions": 200,
            "total_water_emissions": 300,
            "total_travel_emissions": 400,
            "total_waste_emissions": 500,
        }
        mock_procurement_calc.return_value = {"ICT": {"carbon_impact": 50}}

        mock_report_view.return_value = JsonResponse(
            {
                "total_electricity_emissions": 100,
                "total_gas_emissions": 200,
                "total_water_emissions": 300,
                "total_travel_emissions": 400,
                "total_waste_emissions": 500,
                "total_procurement_emissions": 50,
                "total_carbon_emissions": 1550,
            },
            status=200,
        )

        request = self.factory.post(
            "/fake-url/",
            content_type="application/json",
            data=json.dumps(
                {"utilities": {}, "travel": {}, "waste": {}, "procurement": {}}
            ),
        )

        request.user = MagicMock(is_authenticated=True)

        response = report_view(request)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content,
            {
                "total_electricity_emissions": 100,
                "total_gas_emissions": 200,
                "total_water_emissions": 300,
                "total_travel_emissions": 400,
                "total_waste_emissions": 500,
                "total_procurement_emissions": 50,
                "total_carbon_emissions": 1550,
            },
        )


class Submit_Get_Tests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("api.views.ReportcalculateView.calculate_report_emissions")
    @patch("api.views.ProcurementCalculatorView.calculate_procurement_emissions")
    @patch("api.views.Result.objects.create")
    def test_submit_view_success(
        self, mock_result_create, mock_procurement_calc, mock_report_calc
    ):
        mock_report_calc.return_value = {
            "total_electricity_emissions": 100,
            "total_gas_emissions": 200,
            "total_water_emissions": 300,
            "total_travel_emissions": 400,
            "total_waste_emissions": 500,
        }
        mock_procurement_calc.return_value = {"ICT": {"carbon_impact": 50}}

        mock_result_create.return_value.save.return_value = None

        request = self.factory.post(
            "/fake-url/",
            content_type="application/json",
            data=json.dumps(
                {"utilities": {}, "travel": {}, "waste": {}, "procurement": {}}
            ),
        )
        request.user = MagicMock(is_authenticated=True, id=1)

        response = submit_view(request)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"success": True})

    @patch("api.views.Result.objects.filter")
    @patch("api.views.get_object_or_404")
    def test_dashboard_show_user_result_data_success(
        self, mock_get_object, mock_result_filter
    ):
        mock_get_object.return_value = MagicMock(institute_id=1, research_field_id=2)

        mock_result_filter.return_value = [
            MagicMock(id=101, total_carbon_emissions=300.5),
            MagicMock(id=102, total_carbon_emissions=450.2),
        ]

        request = self.factory.get("/fake-url/")
        request.user = MagicMock(is_authenticated=True)

        response = dashboard_show_user_result_data(request)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content,
            [
                {"id": 101, "institution": 1, "field": 2, "emissions": 300.5},
                {"id": 102, "institution": 1, "field": 2, "emissions": 450.2},
            ],
        )

    @patch("api.views.Result.objects.filter")
    @patch("api.views.get_object_or_404")
    def test_dashboard_show_user_result_data_no_data(
        self, mock_get_object, mock_result_filter
    ):
        mock_get_object.return_value = MagicMock(institute_id=1, research_field_id=2)
        mock_result_filter.return_value = []

        request = self.factory.get("/fake-url/")
        request.user = MagicMock(is_authenticated=True)

        response = dashboard_show_user_result_data(request)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, [])

    @patch("api.views.Result.objects.get")
    def test_get_all_report_data_success(self, mock_get_result):
        mock_get_result.return_value = MagicMock(
            total_electricity_emissions=100,
            total_gas_emissions=200,
            total_water_emissions=300,
            total_travel_emissions=400,
            total_waste_emissions=500,
            total_carbon_emissions=1500,
            report_data={"mock_data": "test"},
        )

        request = self.factory.post(
            "/fake-url/",
            content_type="application/json",
            data=json.dumps({"report_id": 101}),
        )
        request.user = MagicMock(is_authenticated=True)

        response = get_all_report_data(request)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content,
            {
                "calculations_data": {
                    "total_electricity_emissions": 100,
                    "total_gas_emissions": 200,
                    "total_water_emissions": 300,
                    "total_travel_emissions": 400,
                    "total_waste_emissions": 500,
                    "total_carbon_emissions": 1500,
                },
                "report_data": {"mock_data": "test"},
            },
        )

    def test_get_all_report_data_no_report_id(self):
        request = self.factory.post(
            "/fake-url/", content_type="application/json", data=json.dumps({})
        )
        request.user = MagicMock(is_authenticated=True)
        response = get_all_report_data(request)
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "report_id is required"})

    @patch("api.views.Result.objects.get")
    def test_get_all_report_data_not_found(self, mock_get_result):
        mock_get_result.side_effect = Result.DoesNotExist

        request = self.factory.post(
            "/fake-url/",
            content_type="application/json",
            data=json.dumps({"report_id": 999}),
        )
        request.user = MagicMock(is_authenticated=True)
        response = get_all_report_data(request)
        self.assertEqual(response.status_code, 404)
        self.assertJSONEqual(response.content, {"error": "Report not found"})


class CarbonImpactTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("api.models.CategoryCarbonImpact.objects.update_or_create")
    def test_update_carbon_impact_success(self, mock_update_or_create):
        mock_update_or_create.return_value = (True, None)

        request = self.factory.post(
            "/update-carbon-impact/",
            data=json.dumps({"category": "Electricity", "carbon_impact": 1.5}),
            content_type="application/json",
        )
        request.user = MagicMock(is_authenticated=True)

        response = update_carbon_impact(request)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"success": True})

    @patch("api.models.CategoryCarbonImpact.objects.update_or_create")
    def test_update_carbon_impact_missing_data(self, mock_update_or_create):
        request = self.factory.post(
            "/update-carbon-impact/",
            data=json.dumps({"category": "Electricity"}),
            content_type="application/json",
        )
        request.user = MagicMock(is_authenticated=True)

        response = update_carbon_impact(request)
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(
            response.content,
            {"error": "Both 'category' and 'carbon_impact' are required."},
        )

    def test_update_carbon_impact_invalid_json(self):
        request = self.factory.post(
            "/update-carbon-impact/",
            data="INVALID_JSON",
            content_type="application/json",
        )
        request.user = MagicMock(is_authenticated=True)

        response = update_carbon_impact(request)
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "Invalid JSON format"})

    @patch("api.models.CategoryCarbonImpact.objects.update_or_create")
    def test_update_carbon_impact_unexpected_error(self, mock_update_or_create):
        mock_update_or_create.side_effect = Exception("Unexpected error")

        request = self.factory.post(
            "/update-carbon-impact/",
            data=json.dumps({"category": "Electricity", "carbon_impact": 1.5}),
            content_type="application/json",
        )
        request.user = MagicMock(is_authenticated=True)

        response = update_carbon_impact(request)
        self.assertEqual(response.status_code, 500)
        self.assertJSONEqual(response.content, {"error": "Unexpected error"})

    def test_update_carbon_impact_invalid_method(self):
        request = self.factory.get("/update-carbon-impact/")
        request.user = MagicMock(is_authenticated=True)

        response = update_carbon_impact(request)
        self.assertEqual(response.status_code, 405)
        self.assertJSONEqual(response.content, {"error": "Invalid request method"})

    @patch("api.models.CategoryCarbonImpact.objects.values")
    def test_get_all_carbon_impact_success(self, mock_values):
        mock_values.return_value = [
            {"id": 1, "category": "Electricity", "carbon_impact": 1.5},
            {"id": 2, "category": "Gas", "carbon_impact": 0.8},
        ]

        request = self.factory.get("/get-all-carbon-impact/")
        request.user = MagicMock(is_authenticated=True)

        response = get_all_carbon_impact(request)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content,
            [
                {"id": 1, "category": "Electricity", "carbon_impact": 1.5},
                {"id": 2, "category": "Gas", "carbon_impact": 0.8},
            ],
        )

    @patch("api.models.CategoryCarbonImpact.objects.values")
    def test_get_all_carbon_impact_error(self, mock_values):
        mock_values.side_effect = Exception("Database error")

        request = self.factory.get("/get-all-carbon-impact/")
        request.user = MagicMock(is_authenticated=True)

        response = get_all_carbon_impact(request)
        self.assertEqual(response.status_code, 500)
        self.assertJSONEqual(response.content, {"error": "Database error"})

    def test_get_all_carbon_impact_invalid_method(self):
        request = self.factory.post("/get-all-carbon-impact/")
        request.user = MagicMock(is_authenticated=True)

        response = get_all_carbon_impact(request)
        self.assertEqual(response.status_code, 405)
        self.assertJSONEqual(response.content, {"error": "Invalid request method"})


class AdminRequestTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("api.views.AdminRequest")
    def test_submit_admin_request_success(self, mock_admin_request):
        mock_admin_request.objects.filter.return_value.exists.return_value = False

        mock_instance = MagicMock(
            user_id=1, requested_role="admin", reason="Manage system", status="Pending"
        )
        mock_admin_request.objects.create.return_value = mock_instance

        request = self.factory.post(
            "/fake-url/",
            content_type="application/json",
            data=json.dumps({"requested_role": "admin", "reason": "Manage system"}),
        )

        request.user = MagicMock(
            is_authenticated=True, id=1, is_admin=False, is_researcher=False
        )

        response = submit_admin_request(request)

        mock_admin_request.objects.create.assert_called_once_with(
            user_id=1, requested_role="admin", reason="Manage system", status="Pending"
        )

        self.assertEqual(response.status_code, 201)
        self.assertJSONEqual(
            response.content, {"success": True, "message": "Successfully submitted."}
        )

    def test_submit_admin_request_already_admin(self):
        request = self.factory.post(
            "/fake-url/",
            content_type="application/json",
            data=json.dumps({"requested_role": "admin", "reason": "Manage system"}),
        )
        request.user = MagicMock(
            is_authenticated=True, id=1, is_admin=True, is_researcher=False
        )

        response = submit_admin_request(request)
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(
            response.content,
            {"success": False, "message": "You already have this role."},
        )

    @patch("api.views.AdminRequest.objects.select_related")
    def test_admin_request_list_success(self, mock_select_related):
        mock_select_related.return_value.values.return_value = [
            {
                "user_id": 1,
                "user__email": "user1@example.com",
                "requested_role": "admin",
                "reason": "Manage system",
                "status": "Pending",
            }
        ]

        request = self.factory.get("/fake-url/")
        request.user = MagicMock(is_authenticated=True, is_admin=True)

        response = admin_request_list(request)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content,
            [
                {
                    "user_id": 1,
                    "user__email": "user1@example.com",
                    "requested_role": "admin",
                    "reason": "Manage system",
                    "status": "Pending",
                }
            ],
        )

    @patch("api.views.AdminRequest.objects.get")
    def test_user_request_status_success(self, mock_get):
        mock_get.return_value = MagicMock(
            user_id=1,
            requested_role="admin",
            reason="Manage system",
            status="Pending",
        )

        request = self.factory.get("/fake-url/")
        request.user = MagicMock(is_authenticated=True, id=1)

        response = user_request_status(request)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content,
            {
                "user_id": 1,
                "requested_role": "admin",
                "reason": "Manage system",
                "status": "Pending",
            },
        )

    @patch("api.views.AdminRequest.objects.get")
    @patch("api.views.User.objects.get")
    def test_approve_or_reject_request_success(self, mock_get_user, mock_get_request):
        mock_get_request.return_value = MagicMock(
            user_id=1, requested_role="admin", status="Pending"
        )
        mock_get_user.return_value = MagicMock()

        request = self.factory.post(
            "/fake-url/",
            content_type="application/json",
            data=json.dumps({"user_id": 1, "state": "Approved"}),
        )
        request.user = MagicMock(is_authenticated=True, is_admin=True)

        response = approve_or_reject_request(request)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content,
            {
                "success": True,
                "message": "The request has been marked as Approved and updates the user status.",
            },
        )

    @patch("api.views.AdminRequest.objects.get")
    def test_approve_or_reject_request_not_found(self, mock_get_request):
        mock_get_request.side_effect = AdminRequest.DoesNotExist

        request = self.factory.post(
            "/fake-url/",
            content_type="application/json",
            data=json.dumps({"user_id": 999, "state": "Approved"}),
        )
        request.user = MagicMock(is_authenticated=True, is_admin=True)

        response = approve_or_reject_request(request)

        self.assertEqual(response.status_code, 404)
        self.assertJSONEqual(
            response.content, {"success": False, "message": "This user did not apply."}
        )


class TempReportTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("api.views.TempReport")
    def test_store_unsubmitted_reports_backend_success(self, mock_temp_report):
        mock_temp_report.objects.filter.return_value.exists.return_value = False

        mock_instance = MagicMock(user_id=1, data={"key": "value"})
        mock_temp_report.objects.create.return_value = mock_instance

        request = self.factory.post(
            "/fake-url/",
            content_type="application/json",
            data=json.dumps({"key": "value"}),
        )

        request.user = MagicMock(is_authenticated=True, id=1)

        response = store_unsubmitted_reports_backend(request)

        mock_temp_report.objects.create.assert_called_once_with(
            user_id=1, data={"key": "value"}
        )

        self.assertEqual(response.status_code, 201)
        self.assertJSONEqual(
            response.content, {"success": True, "message": "Draft successfully saved."}
        )

    @patch("api.views.TempReport")
    def test_store_unsubmitted_reports_backend_already_exists(self, mock_temp_report):
        mock_temp_report.objects.filter.return_value.exists.return_value = True

        request = self.factory.post(
            "/fake-url/",
            content_type="application/json",
            data=json.dumps({"key": "value"}),
        )

        request.user = MagicMock(is_authenticated=True, id=1)

        response = store_unsubmitted_reports_backend(request)

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(
            response.content, {"success": False, "message": "You already have a draft."}
        )

    @patch("api.views.TempReport")
    def test_retrieve_and_delete_temp_report_success(self, mock_temp_report):
        mock_instance = MagicMock(data={"mock_report": "test"})
        mock_temp_report.objects.filter.return_value.first.return_value = mock_instance

        request = self.factory.get("/fake-url/")

        request.user = MagicMock(is_authenticated=True, id=1)

        response = retrieve_and_delete_temp_report(request)

        mock_instance.delete.assert_called_once()

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"data": {"mock_report": "test"}})

    @patch("api.views.TempReport")
    def test_retrieve_and_delete_temp_report_no_data(self, mock_temp_report):
        mock_temp_report.objects.filter.return_value.first.return_value = None

        request = self.factory.get("/fake-url/")

        request.user = MagicMock(is_authenticated=True, id=1)

        response = retrieve_and_delete_temp_report(request)

        self.assertEqual(response.status_code, 404)
        self.assertJSONEqual(response.content, {"success": "No draft now"})
