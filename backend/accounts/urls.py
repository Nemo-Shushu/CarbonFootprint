from django.urls import path
from accounts.views import RegisterView, CsrfTokenView, LogoutView,LoginView,UserDetailView, ProportionCalculationView,ConsumptionAndEmissionsView,WaterConsumptionView,TravelEmissionsView,WasteEmissionsView
from . import views

app_name = "accounts"

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('csrf/', CsrfTokenView.as_view(), name='csrf'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/me/', UserDetailView.as_view(), name='user-detail'),
    path('calculate_proportion/', ProportionCalculationView.as_view(), name='calculate_proportion'),
    path('calculate_emissions/', ConsumptionAndEmissionsView.as_view(), name='calculate_emissions'),
    path('calculate_water/', WaterConsumptionView.as_view(), name='calculate_water'),
    path('calculate_travel_emissions/', TravelEmissionsView.as_view(), name='calculate_travel_emissions'),
    path('calculate_waste_emissions/', WasteEmissionsView.as_view(), name='calculate_waste_emissions'),
]