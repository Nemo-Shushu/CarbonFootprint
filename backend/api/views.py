import json
from sqlite3 import IntegrityError

from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from calculator.models import Result, emission_factors
from calculator.models import ProcurementData, CategoryCarbonImpact 
from calculator.models import WasteEmission 
from rest_framework import status



def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response


@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    if username is None or password is None:
        return JsonResponse({'detail': 'Please provide username and password.'}, status=400)

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({'detail': 'Invalid credentials.'}, status=400)

    login(request, user)
    return JsonResponse({'detail': 'Successfully logged in.'})


def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)

    logout(request)
    return JsonResponse({'detail': 'Successfully logged out.'})


@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})

    return JsonResponse({'isAuthenticated': True})


def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})

    print(type(request.user))
    user = request.user
    return JsonResponse({
        'isAuthenticated': True,
        'username': user.username,
        'forename': user.first_name,
        'email': user.email,
        'institute': user.institute,
        'research_field': getattr(user, 'research_field', None),  
    })

def test_view(request):
    return JsonResponse({
        'user': request.user.id
    })

class ProcurementCalculatorView:
    CATEGORY_PREFIX_MAPPING = {
        "Business Services": ["AF","AH","AL","AN","AT","AU","BE","BK","BN","BS","BT","BW","BZ"
        ,"CG","CS"],
        "Food and Catering": ["C","CA","CB","CC","CD","CE","CH","CJ","CM","CP","CQ","CT","CU"
        ,"CU","CV","CZ"],
        "Information and Communication Technologies": ["A","AA","AE","AJ","AK","AM","AP","AR"
        ,"AZ","BI","BJ","BP","BQ","BR"],
        "Waste and Water": [],
        "Medical and Precision Instruments": ["D","DA","DB","DC","DD"],
        "Other Manufactured Products": ["AB","AC","AD","AG","CF","CK","CL","CN","CR","CY","DE"],
        "Paper Products": ["B","BA","BB","BC","BD","BF","BG","BL","BM","BL","BM","BV"],
        "Manufactured Fuels, Chemicals and Glasses": [],
        "Unclassified": ["AQ"],
        "Construction": [],
        "Other Procurement": [],
        "Business Travel": []
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
                category_entry = CategoryCarbonImpact.objects.filter(category=category).first()
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
    BENCHMARK_WATER = {
        "Physical sciences laboratory": 1.7,
        "Medical/Life sciences laboratory": 1.4,
        "Engineering laboratory": 1.7,
        "Office/Admin space": 1.0
    }

    ELECTRICITY_GRID_INTENSITY = 0.212
    ELECTRICITY_TRANSMISSION_DISTRIBUTION = 0.019
    GAS_CARBON_INTENSITY = 0.183
    GAS_TRANSMISSION_DISTRIBUTION = 0.0188
    WATER_CONSUMPTION_CARBON_INTENSITY = 0.149
    WATER_TREATMENT_CARBON_INTENSITY = 0.272

    CARBON_INTENSITY_TRAVEL = {
        "air-eco-short": 0.151, "air-business-short": 0.227,
        "air-eco-long": 0.148, "air-business-long": 0.429,
        "land-car": 0.168, "land-bus": 0.102
    }

    CARBON_INTENSITY_WASTE = {
        "mixed-recycle": 21.294, "general-waste": 446.242,
        "clinical-waste": 297.000, "chemical-waste": 273.000, "bio-waste": 1000.000
    }

    def calculate_report_emissions(self, request):
        utilities = request.get('utilities', {})
        travel = request.get('travel', {})
        waste = request.get('waste', {})
        
        fte_staff = int(utilities.get('FTE-staff', 0))
        fte_members = int(utilities.get('FTE-members', 0))
        if fte_members == 0:
            return {"error": "Total FTE members cannot be zero."}
        
        proportion = fte_staff / fte_members
        total_electricity_emissions = 0
        total_gas_emissions = 0
        total_water_emissions = 0
        total_travel_emissions = 0
        total_waste_emissions = 0

        # 计算水、电、气排放
        for space_type, area_key in {
            "Academic laboratory": "academic-laboratory-area",
            "Academic office": "academic-office-area",
            "Admin office": "admin-office-area"
        }.items():
            total_area = float(utilities.get(area_key, 0))
            factor = emission_factors.objects.filter(category=space_type).first()
            if total_area and factor:
                total_electricity_emissions += total_area * factor.benchmark_electricity * proportion * 0.231
                total_gas_emissions += total_area * factor.benchmark_gas * proportion * 0.201
        
        for space_type, area_key in {
            "Physical sciences laboratory": "physical-laboratory-area",
            "Medical/Life sciences laboratory": "medical-laboratory-area",
            "Engineering laboratory": "engineering-laboratory-area",
            "Office/Admin space": "admin-space-area"
        }.items():
            total_area = float(utilities.get(area_key, 0))
            if total_area:
                total_water_emissions += total_area * self.BENCHMARK_WATER[space_type] * proportion * (self.WATER_CONSUMPTION_CARBON_INTENSITY + self.WATER_TREATMENT_CARBON_INTENSITY)

        # 计算出行碳排放
        for mode, distance in travel.items():
            if mode in self.CARBON_INTENSITY_TRAVEL:
                total_travel_emissions += float(distance) * self.CARBON_INTENSITY_TRAVEL[mode]

        # 计算废弃物碳排放
        for waste_type, amount in waste.items():
            waste_entry = WasteEmission.objects.filter(type_of_waste=waste_type).first()
            if waste_entry and waste_entry.carbon_intensity is not None:
                try:
                    total_waste_emissions += float(amount) * float(waste_entry.carbon_intensity)  # 转换 Decimal 为 float
                except Exception as e:
                    print(f" 计算 {waste_type} 排放错误: {str(e)}")  # Debug 输出
                    
        return {
            "total_electricity_emissions": round(total_electricity_emissions, 2),
            "total_gas_emissions": round(total_gas_emissions, 2),
            "total_water_emissions": round(total_water_emissions, 2),
            "total_travel_emissions": round(total_travel_emissions, 2),
            "total_waste_emissions": round(total_waste_emissions, 2)
        }

@require_POST
def report_view(request):
    try:
        data = json.loads(request.body)  # 解析 JSON 数据
        print(f" 接收到数据: {data}")  # Debug

        utilities = data.get("utilities", {})
        travel = data.get("travel", {})
        waste = data.get("waste", {})
        procurement = data.get("procurement", {})

        if not all(isinstance(d, dict) for d in [utilities, travel, waste, procurement]):
            return JsonResponse({"error": "Invalid input format"}, status=400)

        report_calculator = ReportcalculateView()
        report_data = report_calculator.calculate_report_emissions(data)

        if "error" in report_data:
            return JsonResponse({"error": report_data["error"]}, status=400)

        procurement_calculator = ProcurementCalculatorView()
        procurement_data = procurement_calculator.calculate_procurement_emissions(procurement)
        total_procurement_emissions = sum(category_data["carbon_impact"] for category_data in procurement_data.values())

        total_carbon_emissions = (
            report_data["total_electricity_emissions"] +
            report_data["total_gas_emissions"] +
            report_data["total_water_emissions"] +
            report_data["total_travel_emissions"] +
            report_data["total_waste_emissions"] +
            total_procurement_emissions
        )

        response_data = {
            **report_data,
            "total_procurement_emissions": round(total_procurement_emissions, 2),
            "total_carbon_emissions": round(total_carbon_emissions, 2)
        }

        return JsonResponse(response_data, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@require_POST
def submit_view(request):
    try:
        # if not request.user or not request.user.is_authenticated:
        #     return JsonResponse({"error": "User not authenticated"}, status=400)

        # 解析 JSON 数据
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

        utilities = data.get("utilities", {})
        travel = data.get("travel", {})
        waste = data.get("waste", {})
        procurement = data.get("procurement", {})

        # 确保数据格式正确
        if not all(isinstance(d, dict) for d in [utilities, travel, waste, procurement]):
            return JsonResponse({"error": "Invalid input format"}, status=400)

        # 计算碳排放
        report_calculator = ReportcalculateView()
        report_data = report_calculator.calculate_report_emissions(data)

        if "error" in report_data:
            return JsonResponse({"error": report_data["error"]}, status=400)

        procurement_calculator = ProcurementCalculatorView()
        procurement_data = procurement_calculator.calculate_procurement_emissions(procurement)
        total_procurement_emissions = sum(category_data["carbon_impact"] for category_data in procurement_data.values())

        total_carbon_emissions = (
            report_data["total_electricity_emissions"] +
            report_data["total_gas_emissions"] +
            report_data["total_water_emissions"] +
            report_data["total_travel_emissions"] +
            report_data["total_waste_emissions"] +
            total_procurement_emissions
        )

        # 存储到数据库
        result_entry = Result.objects.create(
                user_id=request.user.id,
                total_electricity_emissions=report_data["total_electricity_emissions"],
                total_gas_emissions=report_data["total_gas_emissions"],
                total_water_emissions=report_data["total_water_emissions"],
                total_travel_emissions=report_data["total_travel_emissions"],
                total_waste_emissions=report_data["total_waste_emissions"],
                total_procurement_emissions=total_procurement_emissions,
                total_carbon_emissions=total_carbon_emissions
            )
        result_entry.save()
            
        return JsonResponse({"success": True}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

#  CSRF 令牌获取 API
def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrftoken': csrf_token})


