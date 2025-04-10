from decimal import Decimal
import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from rest_framework.views import APIView
from rest_framework import status
from api.models import AccountsUniversity, AdminRequest, Result, TempReport
from api.models import ProcurementData, CategoryCarbonImpact
from api.models import BenchmarkData
from accounts.models import User
from django.utils import timezone
from datetime import datetime
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from accounts.models import University, ResearchField
from rest_framework.response import Response
from .serializers import (
    InstitutionSerializer,
    ResearchFieldSerializer,
    GetIntensitySerializer,
    UpdateIntensitySerializer,
)


def get_csrf(request):
    response = JsonResponse({"detail": "CSRF cookie set"})
    response["X-CSRFToken"] = get_token(request)
    return response


@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    if username is None or password is None:
        return JsonResponse(
            {"detail": "Please provide username and password."}, status=400
        )

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({"detail": "Invalid credentials."}, status=400)
    request.session["login_time"] = timezone.now().isoformat()
    login(request, user)
    return JsonResponse({"detail": "Successfully logged in."})


def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You're not logged in."}, status=400)

    logout(request)
    return JsonResponse({"detail": "Successfully logged out."})


@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False})

    return JsonResponse({"isAuthenticated": True})


def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False})

    print(type(request.user))
    user = request.user
    return JsonResponse(
        {
            "isAuthenticated": True,
            "username": user.username,
            "forename": user.first_name,
            "lastname": user.last_name,
            "email": user.email,
            "institute": user.institute.name,
            "research_field": user.research_field.name,
            "isAdmin": user.is_admin,
            "isResearcher": user.is_researcher,
            "dateJoined": user.date_joined,
        }
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def institution_list(request):
    institutions = University.objects.all()
    serializer_class = InstitutionSerializer(institutions, many=True)
    return Response(serializer_class.data)


@api_view(["GET"])
@permission_classes([AllowAny])
def field_list(request):
    fields = ResearchField.objects.all()
    serializer_class = ResearchFieldSerializer(fields, many=True)
    return Response(serializer_class.data)


class ProcurementCalculatorView:
    CATEGORY_PREFIX_MAPPING = {
        "Business Services": [
            "AF",
            "AH",
            "AL",
            "AN",
            "AT",
            "AU",
            "BE",
            "BK",
            "BN",
            "BS",
            "BT",
            "BW",
            "BZ",
            "CG",
            "CS",
            "EF",
            "EG",
            "EZ",
            "FJ",
            "GC",
            "GD",
            "GG",
            "GH",
            "H",
            "HD",
            "HG",
            "JF",
            "KJ",
            "KO",
            "KS",
            "KT",
            "KU",
            "LI",
            "N",
            "NA",
            "NB",
            "ND",
            "NE",
            "NF",
            "PB",
            "PF",
            "Q",
            "QA",
            "QB",
            "QC",
            "QD",
            "QE",
            "QH",
            "QJ",
            "QL",
            "QM",
            "QR",
            "QS",
            "QT",
            "QZ",
            "R",
            "RA",
            "RB",
            "RC",
            "RD",
            "RE",
            "RG",
            "RI",
            "RJ",
            "RK",
            "RL",
            "RM",
            "RN",
            "RP",
            "RQ",
            "RR",
            "RS",
            "RT",
            "RU",
            "RV",
            "RW",
            "RX",
            "RY",
            "RZ",
            "SE",
            "TO",
            "TQ",
            "TR",
            "TS",
            "U",
            "UF",
            "UH",
            "UL",
            "UZ",
            "VD",
            "VE",
            "WD",
            "WE",
            "WG",
            "WH",
            "WI",
            "WK",
            "WL",
            "WM",
            "WN",
            "WT",
            "WU",
            "WV",
            "WW",
            "WZ",
            "X",
            "XE",
            "XH",
            "XK",
            "XP",
            "XQ",
            "XS",
            "XT",
            "XY",
            "XZ",
            "Y",
            "YA",
            "YB",
            "YC",
            "YD",
            "YE",
            "YF",
            "YP",
            "YQ",
            "YS",
        ],
        "Food and Catering": [
            "C",
            "CA",
            "CB",
            "CC",
            "CD",
            "CE",
            "CH",
            "CJ",
            "CM",
            "CP",
            "CQ",
            "CT",
            "CU",
            "CU",
            "CV",
            "CZ",
            "YR",
        ],
        "Information and Communication Technologies": [
            "A",
            "AA",
            "AE",
            "AJ",
            "AK",
            "AM",
            "AP",
            "AR",
            "AZ",
            "BI",
            "BJ",
            "BP",
            "BQ",
            "BR",
            "K",
            "KB",
            "KC",
            "KD",
            "KE",
            "KF",
            "KG",
            "KH",
            "KI",
            "KK",
            "KL",
            "KM",
            "KN",
            "KP",
            "KQ",
            "KR",
            "KV",
            "KW",
            "KZ",
            "PE",
            "PJ",
            "PK",
            "QG",
            "QN",
            "SG",
            "SK",
            "UJ",
        ],
        "Waste and Water": [
            "JE",
            "LY",
            "UA",
            "UG",
            "WO",
            "WQ",
            "WS",
            "YG",
            "YH",
            "YJ",
            "YK",
            "YL",
        ],
        "Medical and Precision Instruments": [
            "D",
            "DA",
            "DB",
            "DC",
            "DD",
            "DF",
            "DH",
            "DJ",
            "DL",
            "EJ",
            "ET",
            "L",
            "LA",
            "LC",
            "LD",
            "LE",
            "LF",
            "LG",
            "LH",
            "LK",
            "LL",
            "LM",
            "LP",
            "LQ",
            "LR",
            "LS",
            "LT",
            "LU",
            "LV",
            "LW",
            "LX",
            "LZ",
            "UC",
            "UP",
        ],
        "Other Manufactured Products": [
            "AB",
            "AC",
            "AD",
            "AG",
            "CF",
            "CK",
            "CL",
            "CN",
            "CR",
            "CY",
            "DE",
            "DK",
            "E",
            "EA",
            "EB",
            "EC",
            "ED",
            "EH",
            "EK",
            "EL",
            "EM",
            "EN",
            "EP",
            "ES",
            "F",
            "FA",
            "FB",
            "FC",
            "FE",
            "FF",
            "FG",
            "FH",
            "FK",
            "FL",
            "FN",
            "FO",
            "FP",
            "FQ",
            "FR",
            "FS",
            "FT",
            "FU",
            "FZ",
            "GA",
            "GB",
            "GE",
            "GF",
            "GJ",
            "HB",
            "HC",
            "HE",
            "HF",
            "HK",
            "HL",
            "HN",
            "HP",
            "HQ",
            "HR",
            "HS",
            "HZ",
            "LB",
            "LJ",
            "M",
            "MA",
            "MB",
            "MC",
            "MD",
            "ME",
            "MF",
            "MG",
            "MH",
            "ML",
            "MN",
            "MP",
            "MR",
            "MS",
            "MT",
            "MZ",
            "MD",
            "ME",
            "MF",
            "MG",
            "MH",
            "ML",
            "MN",
            "MP",
            "MR",
            "MS",
            "MT",
            "MZ",
            "NC",
            "NG",
            "NH",
            "SC",
            "UB",
            "UD",
            "UE",
            "UK",
            "UM",
            "UN",
            "VA",
            "VF",
            "VH",
            "VJ",
            "VK",
            "VL",
            "VM",
            "VR",
            "WA",
            "WF",
            "WJ",
            "WP",
            "WX",
            "WY",
            "XF",
            "XM",
            "YM",
            "YN",
        ],
        "Paper Products": [
            "B",
            "BA",
            "BB",
            "BC",
            "BD",
            "BF",
            "BG",
            "BL",
            "BM",
            "BL",
            "BM",
            "BV",
            "KA",
            "P",
            "PA",
            "PC",
            "PD",
            "PG",
            "PH",
            "PZ",
            "S",
            "SA",
            "SB",
            "SD",
            "SF",
            "SH",
            "SJ",
            "SL",
            "SZ",
        ],
        "Manufactured Fuels, Chemicals and Glasses": ["HA", "HH", "HJ", "LN"],
        "Unclassified": ["AQ", "DG", "DZ", "ER", "FM", "JG", "QF", "QP", "YY"],
        "Construction": [
            "FD",
            "MJ",
            "MK",
            "MM",
            "MQ",
            "MJ",
            "MK",
            "MM",
            "MQ",
            "W",
            "WB",
            "WC",
        ],
        "Other Procurement": ["G", "JH", "JJ"],
        "Business Travel": [
            "T",
            "TA",
            "TB",
            "TC",
            "TD",
            "TF",
            "TG",
            "TH",
            "TJ",
            "TK",
            "TL",
            "TM",
            "TN",
            "TP",
            "TT",
            "TU",
            "TZ",
            "V",
            "VC",
            "VZ",
        ],
        "Scope 1 & 2 emissions": ["J", "JA", "JB", "JC", "JD", "JZ", "TF", "VG", "WR"],
    }

    def calculate_procurement_emissions(self, expenses):
        result = {}
        for code, spend in expenses.items():
            spend = float(spend)
            procurement_entry = ProcurementData.objects.filter(code=code).first()
            if not procurement_entry:
                continue
            description_dict = procurement_entry.description_dict
            total_carbon_impact = 0
            for category, proportion in description_dict.items():
                category_entry = CategoryCarbonImpact.objects.filter(
                    category=category
                ).first()
                if not category_entry:
                    continue
                carbon_factor = category_entry.carbon_impact
                total_carbon_impact += (spend / 1000) * proportion * carbon_factor
            category_found = None
            for category, prefixes in self.CATEGORY_PREFIX_MAPPING.items():
                if code in prefixes:
                    category_found = category
                    break
            if category_found:
                if category_found not in result:
                    result[category_found] = {"spend": 0, "carbon_impact": 0}
                result[category_found]["spend"] += spend
                result[category_found]["carbon_impact"] += total_carbon_impact
        return result


class ReportcalculateView:
    def __init__(self, user_institute_id=None):
        self.user_institute_id = user_institute_id

    def get_factor(self, category, consumption_type):
        """Retrieve emission factors from the `accounts_benchmarkdata` database"""
        print(
            f"Querying database: category={category}, consumption_type={consumption_type}"
        )
        factor = BenchmarkData.objects.filter(
            category__iexact=consumption_type.strip(),
            consumption_type__iexact=category.strip(),
        ).first()
        if factor:
            intensity = float(factor.intensity) if factor.intensity is not None else 0.0
            transmission_distribution = (
                float(factor.transmission_distribution)
                if factor.transmission_distribution is not None
                else 0.0
            )
            amount = float(factor.amount) if factor.amount is not None else 1.0
            total_intensity = intensity + transmission_distribution
            print(
                f"Query successful: {category} ({consumption_type}) → Intensity: {intensity}, Transmission: {transmission_distribution}, Consumption Amount: {amount}"
            )
            return total_intensity, amount
        else:
            print(
                f"Query failed: {category} ({consumption_type}) → No matching data found in the database"
            )
            return 0.0, 1.0

    def get_university_energy_data(self, energy_type, space_type):
        """Retrieve energy data from `accounts_university` for specific space types."""
        if not self.user_institute_id:
            print("No valid institute ID provided.")
            return 0.0

        university = AccountsUniversity.objects.filter(
            name=self.user_institute_id
        ).first()
        if not university:
            print(f"No university data found for {self.user_institute_id}")
            return 0.0

        mapping = {
            "electricity": {
                "Academic Laboratory": float(
                    university.academic_laboratory_electricity or 0.0
                ),
                "Academic Office": float(university.academic_office_electricity or 0.0),
                "Admin Office": float(university.admin_office_electricity or 0.0),
            },
            "gas": {
                "Academic Laboratory": float(university.academic_laboratory_gas or 0.0),
                "Academic Office": float(university.academic_office_gas or 0.0),
                "Admin Office": float(university.admin_office_gas or 0.0),
            },
        }

        return mapping.get(energy_type, {}).get(space_type, 0.0)

    def calculate_report_emissions(self, request):
        """Calculate total carbon emissions for electricity, gas, water, travel, and waste"""

        # === 新增：用于移除空值（""）的函数 ===
        def remove_empty_values(data):
            return {k: v for k, v in data.items() if v != ""}

        utilities = remove_empty_values(request.get("utilities", {}))
        travel = remove_empty_values(request.get("travel", {}))
        waste = remove_empty_values(request.get("waste", {}))
        fte_staff = int(utilities.get("FTE-staff", 0))
        fte_members = int(utilities.get("FTE-members", 0))
        if fte_members == 0:
            return {"error": "Total FTE members cannot be zero."}
        proportion = fte_staff / fte_members
        total_electricity_emissions = 0
        total_gas_emissions = 0
        total_water_emissions = 0
        total_travel_emissions = 0
        total_waste_emissions = 0
        for space_type in ["Academic Laboratory", "Academic Office", "Admin Office"]:
            total_area = float(utilities.get(space_type, 0))
            print(
                f"Checking `{space_type}`: Received={utilities.get(space_type, 'None')} → Converted={total_area}"
            )

            electricity_amount = self.get_university_energy_data(
                "electricity", space_type
            )
            gas_amount = self.get_university_energy_data("gas", space_type)

            electricity_factor, _ = self.get_factor("electricity", space_type)
            gas_factor, _ = self.get_factor("gas", space_type)

            if total_area > 0:
                electricity_consumption = total_area * electricity_amount
                gas_consumption = total_area * gas_amount
                electricity_emission = (
                    electricity_consumption * electricity_factor * proportion
                )
                gas_emission = gas_consumption * gas_factor * proportion
                print(
                    f"Calculating electricity emissions: {total_area}m² × {electricity_amount} × {electricity_factor} × {proportion} = {electricity_emission}"
                )
                print(
                    f"Calculating gas emissions: {total_area}m² × {gas_amount} × {gas_factor} × {proportion} = {gas_emission}"
                )
                total_electricity_emissions += electricity_emission
                total_gas_emissions += gas_emission

        for space_type in [
            "Physical Sciences Laboratory",
            "Medical/Life Sciences Laboratory",
            "Engineering Laboratory",
            "Office/Admin Space",
        ]:
            total_area = float(utilities.get(space_type, 0))
            print(
                f"Checking `{space_type}`: Received={utilities.get(space_type, 'None')} → Converted={total_area}"
            )
            water_factor, water_amount = self.get_factor("water", space_type)
            if total_area > 0:
                water_consumption = total_area * water_amount
                water_emission = water_consumption * water_factor * proportion
                print(
                    f" Calculating water emissions: {total_area}m² × {water_amount} × {water_factor} × {proportion} = {water_emission}"
                )
                total_water_emissions += water_emission
        # **Calculate travel emissions**
        for mode, distance in travel.items():
            travel_factor, _ = self.get_factor("travel", mode)
            travel_emission = float(distance) * travel_factor
            print(
                f" Calculating travel emissions: {distance}km × {travel_factor}  = {travel_emission}"
            )
            total_travel_emissions += travel_emission
        # **Calculate waste emissions**
        for waste_type, amount in waste.items():
            waste_factor, _ = self.get_factor("waste", waste_type)
            waste_emission = float(amount) * waste_factor
            print(
                f"Calculating waste emissions: {amount}kg × {waste_factor}= {waste_emission}"
            )
            total_waste_emissions += waste_emission
        print(
            f"Final check: Water emissions {total_water_emissions}, Electricity {total_electricity_emissions}, Gas {total_gas_emissions}"
        )
        return {
            "total_electricity_emissions": round(total_electricity_emissions / 1000, 2),
            "total_gas_emissions": round(total_gas_emissions / 1000, 2),
            "total_water_emissions": round(total_water_emissions / 1000, 2),
            "total_travel_emissions": round(total_travel_emissions / 1000, 2),
            "total_waste_emissions": round(total_waste_emissions / 1000, 2),
        }


@require_POST
def report_view(request):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Please login first."}, status=403)
        try:
            data = json.loads(request.body)  # Parse JSON data
            print(f" Data received: {data}")  # Debug
            utilities = data.get("utilities", {})
            travel = data.get("travel", {})
            waste = data.get("waste", {})
            procurement = data.get("procurement", {})
            if not all(
                isinstance(d, dict) for d in [utilities, travel, waste, procurement]
            ):
                return JsonResponse({"error": "Invalid input format"}, status=400)
            user = request.user
            user_institute_id = user.institute_id
            report_calculator = ReportcalculateView(user_institute_id)
            report_data = report_calculator.calculate_report_emissions(data)
            if "error" in report_data:
                return JsonResponse({"error": report_data["error"]}, status=400)
            procurement_calculator = ProcurementCalculatorView()
            procurement_data = procurement_calculator.calculate_procurement_emissions(
                procurement
            )
            total_procurement_emissions = sum(
                category_data["carbon_impact"]
                for category_data in procurement_data.values()
            )
            total_carbon_emissions = (
                report_data["total_electricity_emissions"]
                + report_data["total_gas_emissions"]
                + report_data["total_water_emissions"]
                + report_data["total_travel_emissions"]
                + report_data["total_waste_emissions"]
                + total_procurement_emissions
            )
            response_data = {
                **report_data,
                "total_procurement_emissions": round(total_procurement_emissions, 2),
                "total_carbon_emissions": round(total_carbon_emissions, 2),
            }
            return JsonResponse(response_data, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


@require_POST
def submit_view(request):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Please login first."}, status=403)
        try:
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({"error": "Invalid JSON format"}, status=400)
            utilities = data.get("utilities", {})
            travel = data.get("travel", {})
            waste = data.get("waste", {})
            procurement = data.get("procurement", {})
            # Ensure data format is correct
            if not all(
                isinstance(d, dict) for d in [utilities, travel, waste, procurement]
            ):
                return JsonResponse({"error": "Invalid input format"}, status=400)
            user = request.user
            user_institute_id = user.institute_id
            report_calculator = ReportcalculateView(user_institute_id)
            report_data = report_calculator.calculate_report_emissions(data)
            if "error" in report_data:
                return JsonResponse({"error": report_data["error"]}, status=400)
            procurement_calculator = ProcurementCalculatorView()
            procurement_data = procurement_calculator.calculate_procurement_emissions(
                procurement
            )
            total_procurement_emissions = sum(
                category_data["carbon_impact"]
                for category_data in procurement_data.values()
            )
            total_carbon_emissions = (
                report_data["total_electricity_emissions"]
                + report_data["total_gas_emissions"]
                + report_data["total_water_emissions"]
                + report_data["total_travel_emissions"]
                + report_data["total_waste_emissions"]
                + total_procurement_emissions
            )
            # Store to database
            result_entry = Result.objects.create(
                user_id=request.user.id,
                total_electricity_emissions=report_data["total_electricity_emissions"],
                total_gas_emissions=report_data["total_gas_emissions"],
                total_water_emissions=report_data["total_water_emissions"],
                total_travel_emissions=report_data["total_travel_emissions"],
                total_waste_emissions=report_data["total_waste_emissions"],
                total_procurement_emissions=total_procurement_emissions,
                total_carbon_emissions=total_carbon_emissions,
                report_data=data,
            )
            result_entry.save()
            return JsonResponse({"success": True}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


#  CSRF Token Retrieval API
def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({"csrftoken": csrf_token})


def dashboard_show_user_result_data(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Please login first."}, status=403)
    try:
        user_id = request.user.id
        user_profile = get_object_or_404(User, id=user_id)
        if request.user.is_admin or request.user.is_researcher:
            calculation_result = Result.objects.all().select_related("user")
        else:
            calculation_result = (
                Result.objects.filter(user_id=user_id)
                | Result.objects.filter(user__institute_id=user_profile.institute_id)
                | Result.objects.filter(
                    user__research_field_id=user_profile.research_field_id
                )
            )
        data = [
            {
                "id": Result.id,
                "institution": Result.user.institute_id,
                "field": Result.user.research_field_id,
                "emissions": float(Result.total_carbon_emissions),
                "email": Result.user.email,
                "own_report": user_id == Result.user.id,
            }
            for Result in calculation_result
        ]

        return JsonResponse(data, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


def get_all_report_data(request):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Please login first."}, status=403)
        try:
            data = json.loads(request.body)
            report_id = data.get("report_id")
            if not report_id:
                return JsonResponse({"error": "report_id is required"}, status=400)
            report = Result.objects.get(id=report_id)
            response_data = {
                "calculations_data": {
                    "total_electricity_emissions": float(
                        report.total_electricity_emissions
                    ),
                    "total_gas_emissions": float(report.total_gas_emissions),
                    "total_water_emissions": float(report.total_water_emissions),
                    "total_travel_emissions": float(report.total_travel_emissions),
                    "total_waste_emissions": float(report.total_waste_emissions),
                    "total_procurement_emissions": float(
                        report.total_procurement_emissions
                    ),
                    "total_carbon_emissions": float(report.total_carbon_emissions),
                },
                "report_data": report.report_data,
            }
            return JsonResponse(response_data)
        except Result.DoesNotExist:
            return JsonResponse({"error": "Report not found"}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)


@api_view(["GET", "PUT"])
@permission_classes([IsAdminUser])
def update_intensity_view(request):
    if request.method == "GET":
        queryset = BenchmarkData.objects.values(
            "id",
            "category",
            "intensity",
            "consumption_type",
            "unit",
            "transmission_distribution",
        ).order_by("category")
        serializer = GetIntensitySerializer(queryset, many=True)
        return Response(serializer.data)

    elif request.method == "PUT":
        if not isinstance(request.data, list):
            return Response(
                {"detail": "Expected a list of objects."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        updated_objects = []
        errors = []

        for item in request.data:
            id = item.get("id")

            if not id:
                errors.append({"detail": "id is required.", "data": item})
                continue

            try:
                benchmark_instance = BenchmarkData.objects.get(id=id)
            except BenchmarkData.DoesNotExist:
                errors.append(
                    {"detail": f"intensity factor with id {id} not found", "data": item}
                )
                continue

            if benchmark_instance.consumption_type not in [
                "gas",
                "water",
                "electricity",
            ]:
                item.pop("transmission_distribution", None)

            # Update the existing object
            serializer = UpdateIntensitySerializer(
                benchmark_instance, data=item, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                updated_objects.append(serializer.data)
            else:
                errors.append(
                    {
                        "detail": "Validation failed.",
                        "errors": serializer.errors,
                        "data": item,
                    }
                )

        response_data = {"updated": updated_objects}
        if errors:
            response_data["errors"] = errors

        return Response(
            response_data,
            status=status.HTTP_200_OK
            if updated_objects
            else status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
@permission_classes([IsAdminUser])
def update_carbon_impact(request):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Please login first."}, status=status.HTTP_403_FORBIDDEN
        )

    try:
        data = request.data

        # Check if data is a list for bulk operations
        if isinstance(data, list):
            results = []
            for item in data:
                category = item.get("category")
                carbon_impact = item.get("carbon_impact")

                if not category or carbon_impact is None:
                    return Response(
                        {
                            "error": "Both 'category' and 'carbon_impact' are required for each item."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                updated, created = CategoryCarbonImpact.objects.update_or_create(
                    category=category, defaults={"carbon_impact": carbon_impact}
                )
                results.append(
                    {
                        "category": category,
                        "updated": updated is not None,
                        "created": created,
                    }
                )

            return Response(
                {"success": True, "results": results}, status=status.HTTP_200_OK
            )

        # Handle single item update
        else:
            category = data.get("category")
            carbon_impact = data.get("carbon_impact")
            if not category or carbon_impact is None:
                return Response(
                    {"error": "Both 'category' and 'carbon_impact' are required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            updated, created = CategoryCarbonImpact.objects.update_or_create(
                category=category, defaults={"carbon_impact": carbon_impact}
            )
            return Response(
                {"success": True, "created": created}, status=status.HTTP_200_OK
            )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_all_carbon_impact(request):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Please login first."}, status=403)
        try:
            data = list(
                CategoryCarbonImpact.objects.values("id", "category", "carbon_impact")
            )
            return JsonResponse(data, safe=False, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)


def submit_admin_request(request):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Please login first."}, status=403)

        user_id = request.user.id

        try:
            data = json.loads(request.body)

            requested_role = data.get("requested_role")
            reason = data.get("reason")

            if not requested_role or not reason:
                return JsonResponse(
                    {"error": "requested_role and reason can't be empty."}, status=400
                )

            if requested_role == "admin" and request.user.is_admin:
                return JsonResponse(
                    {"success": False, "message": "You already have this role."},
                    status=400,
                )

            if requested_role == "researcher" and request.user.is_researcher:
                return JsonResponse(
                    {"success": False, "message": "You already have this role."},
                    status=400,
                )

            if AdminRequest.objects.filter(user_id=user_id).exists():
                return JsonResponse(
                    {"success": False, "message": "You already have a request."},
                    status=400,
                )

            AdminRequest.objects.create(
                user_id=user_id,
                requested_role=requested_role,
                reason=reason,
                status="Pending",
            )

            return JsonResponse(
                {"success": True, "message": "Successfully submitted."}, status=201
            )

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)


def admin_request_list(request):
    if request.method == "GET":
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"error": "Please login first."}, status=403)

            if not request.user.is_admin:
                return JsonResponse({"error": "Unprivileged access"}, status=403)

            requests = AdminRequest.objects.select_related("user").values(
                "user_id",
                "user__email",
                "user__username",
                "user__institute",
                "requested_role",
                "reason",
                "status",
            )

            request_list = list(requests)

            return JsonResponse(request_list, safe=False, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)


def user_request_status(request):
    if request.method == "GET":
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"error": "Please login first."}, status=403)

            try:
                user_request = AdminRequest.objects.get(user_id=request.user.id)
            except AdminRequest.DoesNotExist:
                return JsonResponse(
                    {"success": False, "message": "You haven't requested yet"},
                    status=404,
                )

            if user_request.status == "Pending":
                return JsonResponse(
                    {
                        "user_id": user_request.user_id,
                        "requested_role": user_request.requested_role,
                        "reason": user_request.reason,
                        "status": user_request.status,
                        "success": True,
                    },
                    status=200,
                )

            response_data = {
                "user_id": user_request.user_id,
                "requested_role": user_request.requested_role,
                "reason": user_request.reason,
                "status": user_request.status,
                "success": True,
            }
            user_request.delete()

            return JsonResponse(response_data, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)


def approve_or_reject_request(request):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Please login first."}, status=403)

        if not request.user.is_admin:
            return JsonResponse({"error": "Unprivileged access"}, status=403)

        try:
            data = json.loads(request.body)

            user_id = data.get("user_id")
            state = data.get("state")

            print(request)
            if state not in ["Approved", "Rejected"]:
                return JsonResponse(
                    {"error": "state Just could be 'Approved' or 'Rejected'。"},
                    status=400,
                )

            try:
                user_request = AdminRequest.objects.get(user_id=user_id)
            except AdminRequest.DoesNotExist:
                return JsonResponse(
                    {"success": False, "message": "This user did not apply."},
                    status=404,
                )

            user_request.status = state
            user_request.save()

            if state == "Approved":
                try:
                    user = User.objects.get(id=user_id)
                    if user_request.requested_role == "admin":
                        user.is_admin = True
                        user.is_researcher = False
                    elif user_request.requested_role == "researcher":
                        user.is_admin = False
                        user.is_researcher = True
                    elif user_request.requested_role == "User":
                        user.is_admin = False
                        user.is_researcher = False

                    user.save()

                except User.DoesNotExist:
                    return JsonResponse(
                        {"error": "The User was not found in the User table."},
                        status=404,
                    )

            return JsonResponse(
                {
                    "success": True,
                    "message": f"The request has been marked as {state} and updates the user status.",
                },
                status=200,
            )

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)


def store_unsubmitted_reports_backend(request):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Please login first."}, status=403)

        user_id = request.user.id

        try:
            data = json.loads(request.body)

            temp_report, created = TempReport.objects.update_or_create(
                user_id=user_id, defaults={"data": data}
            )

            return JsonResponse(
                {
                    "success": True,
                    "message": "Draft successfully saved."
                    if created
                    else "Draft successfully updated.",
                },
                status=201 if created else 200,
            )

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)


def retrieve_and_delete_temp_report(request):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Please login first."}, status=403)

        user_id = request.user.id

        try:
            temp_report = TempReport.objects.filter(user_id=user_id).first()

            if temp_report:
                report_data = temp_report.data

                temp_report.delete()

                return JsonResponse({"data": report_data}, status=200)

            return JsonResponse({"data": []}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)


def retrieve_accounts_university(request):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Please login first."}, status=403)

        if not request.user.is_admin and not request.user.is_researcher:
            return JsonResponse({"error": "Unprivileged access"}, status=403)

        try:
            university_data = list(AccountsUniversity.objects.values())
            return JsonResponse({"data": university_data}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)


def update_accounts_university(request):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Please login first."}, status=403)

        if not request.user.is_admin and not request.user.is_researcher:
            return JsonResponse({"error": "Unprivileged access"}, status=403)

        try:
            data = json.loads(request.body)

            if isinstance(data, dict):
                data = [data]

            updated_data = []
            update_made = False

            for entry in data:
                university_name = entry.get("name")
                if not university_name:
                    continue

                university = AccountsUniversity.objects.filter(
                    name=university_name
                ).first()
                if not university:
                    continue

                restricted_fields = [
                    "name",
                    "total_gas_benchmark",
                    "total_electricity_benchmark",
                    "academic_laboratory_gas",
                    "academic_laboratory_electricity",
                    "academic_office_gas",
                    "academic_office_electricity",
                    "admin_office_gas",
                    "admin_office_electricity",
                ]

                updated_fields = {}
                for key, value in entry.items():
                    if key not in restricted_fields and hasattr(university, key):
                        setattr(university, key, Decimal(value))
                        updated_fields[key] = value
                        update_made = True

                if update_made:
                    university.save()
                    updated_data.append(
                        {"name": university.name, "updated_fields": updated_fields}
                    )

            if updated_data:
                return JsonResponse(
                    {
                        "success": "Data updated successfully",
                        "updated_data": updated_data,
                    },
                    status=200,
                )
            else:
                return JsonResponse(
                    {"error": "No valid data provided or no updates made"}, status=400
                )

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            return JsonResponse(
                {"error": f"Unexpected error occurred: {str(e)}"}, status=500
            )

    return JsonResponse({"error": "Invalid request method."}, status=405)


class SessionExpiryView(APIView):
    def get(self, request, format=None):
        login_time = request.session.get("login_time")
        if login_time:
            login_time_dt = datetime.fromisoformat(login_time)
            now = timezone.now()
            elapsed = (now - login_time_dt).total_seconds()
            remaining_time = settings.SESSION_COOKIE_AGE - elapsed
            remaining_time = max(remaining_time, 0)
            remaining_time = round(remaining_time, 0)
        else:
            remaining_time = request.session.get_expiry_age()
            remaining_time = round(remaining_time, 0)
        return Response({"remaining_time": remaining_time}, status=status.HTTP_200_OK)


class ExtendSessionView(APIView):
    def post(self, request, format=None):
        new_expiry = settings.SESSION_COOKIE_AGE
        request.session.set_expiry(new_expiry)
        request.session["login_time"] = timezone.now().isoformat()
        request.session.save()
        remaining_time = request.session.get_expiry_age()
        return Response(
            {"message": "Session extended", "remaining_time": remaining_time},
            status=200,
        )
