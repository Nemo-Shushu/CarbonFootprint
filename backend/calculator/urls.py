from django.urls import path
from calculator.views import ReportcalculateView
from calculator.views import ProcurementCalculatorView

app_name = "calculator"
urlpatterns = [
    path('createreport/', ReportcalculateView.as_view(), name='report_calculate'),
    path('procurement-calculator/', ProcurementCalculatorView.as_view(), name='procurement-calculator'),
]
