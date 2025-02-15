from django.urls import path
from accounts.views import RegisterView, CsrfTokenView, LogoutView, LoginView, ConversionFactorsView
app_name = "accounts"

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('csrf/', CsrfTokenView.as_view(), name='csrf'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('conversion-factors/', ConversionFactorsView.as_view(), name='conversion-factor'),
    
]