from django.urls import path
from .views import ReportcalculateView

urlpatterns = [
    path('ReportcalculateView/', ReportcalculateView.as_view(), name='report_calculate'),
]
