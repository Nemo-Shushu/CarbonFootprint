from django.urls import path
from .views import SessionExpiryView, ExtendSessionView
from . import views

urlpatterns = [
    path("login/", views.login_view, name="api-login"),
    path("logout/", views.logout_view, name="api-logout"),
    path("session/", views.session_view, name="api-session"),
    path("whoami/", views.whoami_view, name="api-whoami"),
    path("csrf/", views.get_csrf, name="api-csrf"),
    path("institutions/", views.institution_list, name="institution_list"),
    path("fields/", views.field_list, name="field_list"),
    path("report/", views.report_view, name="report"),
    path("submit/", views.submit_view, name="submits"),
    path("get-csrf/", views.get_csrf_token, name="get-csrf-token"),
    path(
        "dashboard-show-user-result-data/",
        views.dashboard_show_user_result_data,
        name="dashboard-show-user-result-data",
    ),
    path("get-all-report-data/", views.get_all_report_data, name="get-all-report-data"),
    path(
        "update-carbon-impact/", views.update_carbon_impact, name="update-carbon-impact"
    ),
    path(
        "get-all-carbon-impact/",
        views.get_all_carbon_impact,
        name="get-all-carbon-impact",
    ),
    path("intensity-factors/", views.update_intensity_view, name="intensity-factor"),
    path(
        "update-carbon-impact/", views.update_carbon_impact, name="update-carbon-impact"
    ),
    path(
        "get-all-carbon-impact/",
        views.get_all_carbon_impact,
        name="get-all-carbon-impact",
    ),
    path("submit-adminrequest/", views.submit_admin_request, name="submit_request"),
    path("admin-request-list/", views.admin_request_list, name="admin_request_list"),
    path("user-request-status/", views.user_request_status, name="user_request_status"),
    path(
        "approve-or-reject-request/",
        views.approve_or_reject_request,
        name="approve_or_reject_request",
    ),
    path(
        "store-unsubmitted-reports-backend/",
        views.store_unsubmitted_reports_backend,
        name="store_unsubmitted_reports_backend",
    ),
    path(
        "retrieve-and-delete-temp-report/",
        views.retrieve_and_delete_temp_report,
        name="retrieve_and_delete_temp_report",
    ),
    path('session-expiry/', SessionExpiryView.as_view(), name='session-expiry'),
    path('extend-session/', ExtendSessionView.as_view(), name='extend-session'),
    path(
        "retrieve-accounts-university/",
        views.retrieve_accounts_university,
        name="accounts_university",
    ),
    path(
        "update-accounts-university/",
        views.update_accounts_university,
        name="update_accounts_university",
    ),
    path('admin-get-all-results/', views.admin_get_all_results, name='admin-get-all-results'),
    path('show-same-effect-user-result-data/', views.show_same_effect_user_result_data, name='dashboard_show_same_effect_user_result_data'),
]
