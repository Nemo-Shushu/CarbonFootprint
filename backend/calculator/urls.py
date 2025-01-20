from django.urls import path
from .views import ReportcalculateView

app_name = "calculator"
urlpatterns = [
    path('createreport/', ReportcalculateView.as_view(), name='report_calculate'),
]
