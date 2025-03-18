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
    path("test/", views.test_view, name="api-test"),
    path("report/", views.report_view, name="report"),
    path("submit/", views.submit_view, name="submits"),
    path("get-csrf/", views.get_csrf_token, name="get-csrf-token"),
    path("dashboard-show-user-result-data/", views.dashboard_show_user_result_data, name="dashboard-show-user-result-data"),
    path("get-all-report-data/", views.get_all_report_data, name="get-all-report-data"),
    path("update-carbon-impact/", views.update_carbon_impact, name="update-carbon-impact"),
    path("get-all-carbon-impact/",views.get_all_carbon_impact, name='get-all-carbon-impact'),
    path('session-expiry/', SessionExpiryView.as_view(), name='session-expiry'),
    path('extend-session/', ExtendSessionView.as_view(), name='extend-session'),
]
