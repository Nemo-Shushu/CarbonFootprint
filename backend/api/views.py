import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from api.models import Result
from api.models import ProcurementData, CategoryCarbonImpact
from api.models import BenchmarkData
from api.models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework import status
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


def test_view(request):
    return JsonResponse({"user": request.user.id})


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
    def get_factor(self, category, consumption_type):
        """Retrieve emission factors from the `accounts_benchmarkdata` database"""
        print(
            f"Querying database: category={category}, consumption_type={consumption_type}"
        )  # Debugging query parameters
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
            amount = (
                float(factor.amount) if factor.amount is not None else 1.0
            )  # Default to 1.0 to avoid division issues
            total_intensity = (
                intensity + transmission_distribution
            )  # Sum intensity and transmission
            print(
                f"Query successful: {category} ({consumption_type}) → Intensity: {intensity}, Transmission: {transmission_distribution}, Consumption Amount: {amount}"
            )
            return total_intensity, amount
        else:
            print(
                f"Query failed: {category} ({consumption_type}) → No matching data found in the database"
            )
            return 0.0, 1.0  # Return (0.0, 1.0) if no data is found

    def calculate_report_emissions(self, request):
        """Calculate total carbon emissions for electricity, gas, water, travel, and waste"""
        utilities = request.get("utilities", {})
        travel = request.get("travel", {})
        waste = request.get("waste", {})
        fte_staff = int(utilities.get("FTE-staff", 0))
        fte_members = int(utilities.get("FTE-members", 0))
        if fte_members == 0:
            return {"error": "Total FTE members cannot be zero."}
        proportion = fte_staff / fte_members  # Adjust for staff proportion
        total_electricity_emissions = 0
        total_gas_emissions = 0
        total_water_emissions = 0
        total_travel_emissions = 0
        total_waste_emissions = 0
        # **Calculate electricity and gas emissions**
        for space_type in ["Academic Laboratory", "Academic Office", "Admin Office"]:
            total_area = float(
                utilities.get(space_type, 0)
            )  # Match key directly in `utilities`
            print(
                f"Checking `{space_type}`: Received={utilities.get(space_type, 'None')} → Converted={total_area}"
            )
            electricity_factor, electricity_amount = self.get_factor(
                "electricity", space_type
            )
            gas_factor, gas_amount = self.get_factor("gas", space_type)
            if total_area > 0:
                electricity_consumption = total_area * electricity_amount
                gas_consumption = total_area * gas_amount
                electricity_emission = (
                    electricity_consumption * electricity_factor * proportion
                )
                gas_emission = (
                    gas_consumption * gas_factor * proportion
                )  # Multiply by `proportion`
                print(
                    f"Calculating electricity emissions: {total_area}m² × {electricity_amount} × {electricity_factor} × {proportion} = {electricity_emission}"
                )
                print(
                    f"Calculating gas emissions: {total_area}m² × {gas_amount} × {gas_factor} × {proportion} = {gas_emission}"
                )
                total_electricity_emissions += electricity_emission
                total_gas_emissions += gas_emission

        # **Calculate water emissions**
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
            travel_emission = float(distance) * travel_factor * proportion
            print(
                f" Calculating travel emissions: {distance}km × {travel_factor} × {proportion} = {travel_emission}"
            )
            total_travel_emissions += travel_emission
        # **Calculate waste emissions**
        for waste_type, amount in waste.items():
            waste_factor, _ = self.get_factor("waste", waste_type)
            waste_emission = float(amount) * waste_factor * proportion
            print(
                f"Calculating waste emissions: {amount}kg × {waste_factor} × {proportion} = {waste_emission}"
            )
            total_waste_emissions += waste_emission
        print(
            f"Final check: Water emissions {total_water_emissions}, Electricity {total_electricity_emissions}, Gas {total_gas_emissions}"
        )
        return {
            "total_electricity_emissions": round(total_electricity_emissions, 2),
            "total_gas_emissions": round(total_gas_emissions, 2),
            "total_water_emissions": round(total_water_emissions, 2),
            "total_travel_emissions": round(total_travel_emissions, 2),
            "total_waste_emissions": round(total_waste_emissions, 2),
        }


@require_POST
def report_view(request):
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
        report_calculator = ReportcalculateView()
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
        # Calculate carbon emissions
        report_calculator = ReportcalculateView()
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
    try:
        user_id = request.user.id
        user_profile = get_object_or_404(User, id=user_id)
        calculation_result = Result.objects.filter(user_id=user_id)
        data = [
            {
                "id": Result.id,
                "institution": user_profile.institute_id,
                "field": user_profile.research_field_id,
                "emissions": float(Result.total_carbon_emissions),
            }
            for Result in calculation_result
        ]

        return JsonResponse(data, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


def get_all_report_data(request):
    if request.method == "POST":
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
            "id", "category", "intensity", "consumption_type", "unit"
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
