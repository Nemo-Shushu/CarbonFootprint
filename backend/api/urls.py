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
]