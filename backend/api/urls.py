from django.urls import path

from . import views

urlpatterns = [
    path('login/', views.login_view, name='api-login'),
    path('logout/', views.logout_view, name='api-logout'),
    path('session/', views.session_view, name='api-session'),
    path('whoami/', views.whoami_view, name='api-whoami'),
    path('csrf/', views.get_csrf, name='api-csrf'),
    path('institutions/', views.institution_list, name='institution_list'),
    path('fields/', views.field_list, name='field_list'),
    path('test/', views.test_view, name='api-test'),
    path('report/', views.report_view, name='Report'),
    path('submit/', views.submit_view, name='Submits'),
    path("get-csrf/", views.get_csrf_token, name="get-csrf-token"),
    path("Dashboard_show_user_result_data/", views.Dashboard_show_user_result_data, name="Dashboard_show_user_result_data"),
    path("get_all_report_data/", views.get_all_report_data, name="get_all_report_data")
]