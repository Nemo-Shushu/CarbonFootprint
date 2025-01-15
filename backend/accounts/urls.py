from django.urls import path
from accounts.views import RegisterView, CsrfTokenView, LogoutView,LoginView,UserDetailView, ReportcalculateView
app_name = "accounts"

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('csrf/', CsrfTokenView.as_view(), name='csrf'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/me/', UserDetailView.as_view(), name='user-detail'),
    path('ReportcalculateView/', ReportcalculateView.as_view(), name='calculate_proportion'),
]