from django.urls import path

from . import views

urlpatterns = [
    path('login/', views.login_view, name='api-login'),
    path('logout/', views.logout_view, name='api-logout'),
    path('session/', views.session_view, name='api-session'),
    path('whoami/', views.whoami_view, name='api-whoami'),
    path('csrf/', views.get_csrf, name='api-csrf'),
    path('test/', views.test_view, name='api-test'),
    path('Report/', views.report_view, name='Report'),
    path('Submit/', views.submit_view, name='Submits'),
    path("get-csrf/", views.get_csrf_token, name="get-csrf-token")
]