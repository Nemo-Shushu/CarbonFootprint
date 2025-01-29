from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics, status,viewsets
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated

class ReportcalculateView(APIView):
    permission_classes = (AllowAny,)
    """
    API View to calculate electricity, gas, water, travel, and waste emissions.
    """

    # 预设值
    BENCHMARK_ELECTRICITY = {
        "Academic laboratory": 207.99,
        "Academic office": 108.74,
        "Admin office": 115.17
    }

    BENCHMARK_GAS = {
        "Academic laboratory": 247.39,
        "Academic office": 170.85,
        "Admin office": 180.41
    }

    BENCHMARK_WATER = {
        "Physical sciences laboratory": 1.7,
        "Medical/Life sciences laboratory": 1.4,
        "Engineering laboratory": 1.7,
        "Office/Admin space": 1.0
    }

    # 固定的 Carbon intensity 数据
    CARBON_INTENSITY_TRAVEL = {
        "air-eco-short": 0.151,
        "air-business-short": 0.227,
        "air-eco-long": 0.148,
        "air-business-long": 0.429,
        "air-eco-inter": 0.141,
        "air-business-inter": 0.408,
        "sea-ferry": 0.113,
        "land-car": 0.168,
        "land-motor": 0.114,
        "land-taxis": 0.149,
        "land-bus": 0.102,
        "land-coach": 0.027,
        "land-national-rail": 0.035,
        "land-inter-rail": 0.041,
        "land-light-rail": 0.029
    }

    CARBON_INTENSITY_WASTE = {
        "mixed-recycle": 21.294,
        "WEEEmixed-recycle": 21.294,
        "general-waste": 446.242,
        "clinical-waste": 297.000,
        "chemical-waste": 273.000,
        "bio-waste": 1000.000
    }

    # 预设的 Carbon intensity 和 Transmission & distribution
    ELECTRICITY_GRID_INTENSITY = 0.212
    ELECTRICITY_TRANSMISSION_DISTRIBUTION = 0.019

    GAS_CARBON_INTENSITY = 0.183
    GAS_TRANSMISSION_DISTRIBUTION = 0.0188

    WATER_CONSUMPTION_CARBON_INTENSITY = 0.149
    WATER_TREATMENT_CARBON_INTENSITY = 0.272

    def post(self, request, *args, **kwargs):
        try:
            # 获取请求数据
            utilities = request.data.get('utilities', {})
            travel = request.data.get('travel', {})
            waste = request.data.get('waste', {})

            # 计算比例
            fte_staff = int(utilities.get('FTE-staff', 0))
            fte_members = int(utilities.get('FTE-members', 0))

            if fte_members == 0:
                return Response({'error': 'Total FTE members cannot be zero.'}, status=status.HTTP_400_BAD_REQUEST)

            proportion = fte_staff / fte_members

            electricity_and_gas_results = []
            water_results = []
            travel_results = []
            waste_results = []
            total_electricity_emissions = 0
            total_gas_emissions = 0
            total_water_emissions = 0
            total_travel_emissions = 0
            total_waste_emissions = 0

            # 电力和燃气计算
            for space_type, area_key in {
                "Academic laboratory": "academic-laboratory-area",
                "Academic office": "academic-office-area",
                "Admin office": "admin-office-area"
            }.items():
                total_area = float(utilities.get(area_key, 0))

                if total_area:
                    benchmark_electricity = self.BENCHMARK_ELECTRICITY[space_type]
                    benchmark_gas = self.BENCHMARK_GAS[space_type]

                    electricity_consumption = total_area * benchmark_electricity * proportion
                    gas_consumption = total_area * benchmark_gas * proportion

                    electricity_emissions = electricity_consumption * (
                        self.ELECTRICITY_GRID_INTENSITY + self.ELECTRICITY_TRANSMISSION_DISTRIBUTION
                    )
                    gas_emissions = gas_consumption * (
                        self.GAS_CARBON_INTENSITY + self.GAS_TRANSMISSION_DISTRIBUTION
                    )

                    total_electricity_emissions += electricity_emissions
                    total_gas_emissions += gas_emissions

                    electricity_and_gas_results.append({
                        'type': space_type,
                        'electricity_consumption': round(electricity_consumption, 2),
                        'electricity_emissions': round(electricity_emissions, 2),
                        'gas_consumption': round(gas_consumption, 2),
                        'gas_emissions': round(gas_emissions, 2),
                    })

            # 水计算
            for space_type, area_key in {
                "Physical sciences laboratory": "physical-laboratory-area",
                "Medical/Life sciences laboratory": "medical-laboratory-area",
                "Engineering laboratory": "engineering-laboratory-area",
                "Office/Admin space": "admin-space-area"
            }.items():
                total_area = float(utilities.get(area_key, 0))

                if total_area:
                    benchmark_water = self.BENCHMARK_WATER[space_type]

                    water_consumption = total_area * benchmark_water * proportion
                    water_emissions = water_consumption * (
                        self.WATER_CONSUMPTION_CARBON_INTENSITY + self.WATER_TREATMENT_CARBON_INTENSITY
                    )

                    total_water_emissions += water_emissions

                    water_results.append({
                        'type': space_type,
                        'water_consumption': round(water_consumption, 2),
                        'water_emissions': round(water_emissions, 2)
                    })

            # 出行计算
            for mode, distance in travel.items():
                if mode in self.CARBON_INTENSITY_TRAVEL:
                    carbon_intensity = self.CARBON_INTENSITY_TRAVEL[mode]
                    emissions = float(distance) * carbon_intensity
                    total_travel_emissions += emissions

                    travel_results.append({
                        'mode': mode,
                        'distance': float(distance),
                        'emissions': round(emissions, 2)
                    })

            # 废弃物计算
            for waste_type, amount in waste.items():
                if waste_type in self.CARBON_INTENSITY_WASTE:
                    carbon_intensity = self.CARBON_INTENSITY_WASTE[waste_type]
                    emissions = float(amount) * carbon_intensity
                    total_waste_emissions += emissions

                    waste_results.append({
                        'type': waste_type,
                        'amount': float(amount),
                        'emissions': round(emissions, 2)
                    })

            # 返回综合结果
            return Response(
                {
                    'electricity_and_gas': {
                        'results': electricity_and_gas_results,
                        'total_electricity_emissions': round(total_electricity_emissions, 2),
                        'total_gas_emissions': round(total_gas_emissions, 2)
                    },
                    'water': {
                        'results': water_results,
                        'total_water_emissions': round(total_water_emissions, 2)
                    },
                    'travel': {
                        'results': travel_results,
                        'total_travel_emissions': round(total_travel_emissions, 2)
                    },
                    'waste': {
                        'results': waste_results,
                        'total_waste_emissions': round(total_waste_emissions, 2)
                    }
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProcurementCalculatorView(APIView):
    permission_classes = (AllowAny,)

    # 预设的 Carbon Impact (ton CO2e) 值
    CATEGORY_CARBON_IMPACT = {
        "Business Services": 0.97,
        "Paper Products": 0.19,
        "Other Manufactured Products": 2.02,
        "Manufactured Fuels, Chemicals and Glasses": 0.10,
        "Food and Catering": 0.94,
        "Construction": 1.0,  # 默认值为 0
        "Information and Communication Technologies": 1.44,
        "Waste and Water": 1.0,  # 默认值为 0
        "Medical and Precision Instruments": 1.84,
        "Other Procurement": 1.0,  # 默认值为 0
        "Unclassified": 1.0,  # 默认值为 0
        "Business Travel":1.0
    }

    # 类别与前缀映射关系
    CATEGORY_PREFIX_MAPPING = {
    "Business Services": [
        "AF", "AH", "AL", "AT", "AU", "BE", "BK", "BN", "BS", "BT", "BW",
        "CG", "CS", "EF", "EG", "GC", "GD", "GG", "GH", "H", "HD", "HG",
        "JF", "KJ", "KO", "KS", "KT", "KU", "LI", "N", "NA", "NB", "ND",
        "NE", "NF", "Q", "QH", "QJ", "QR", "QT", "R", "RA", "RB", "RC",
        "RD", "RE", "RG", "RI", "RJ", "RK", "RL", "RM", "RN", "RP", "RQ",
        "RR", "RS", "RT", "RU", "RV", "RW", "RX", "RY", "TQ", "TR", "U",
        "UF", "UH", "UL", "VD", "VE", "WD", "WH", "WK", "WL", "WN", "WU",
        "YA", "YB", "YC", "YD", "YE", "YF", "YP", "YQ", "YS", "AB"
    ],
    "Food and Catering": [
        "CA", "CB", "CC", "CD", "CE", "CH", "CJ", "CM", "CP", "CQ", "CU",
        "CV", "YR"
    ],
    "Information and Communication Technologies": [
        "AE", "AJ", "BI", "BJ", "BP", "BQ", "BR", "K", "KE", "KG", "KH",
        "KI", "KM", "KN", "KV", "KW", "QG", "QN", "UJ"
    ],
    "Waste and Water": [
        "JE", "YG", "YH", "YJ", "YK", "YL", "LN", "HH"
    ],
    "Medical and Precision Instruments": [
        "D", "DA", "DB", "DC", "DF", "DH", "DJ", "DL", "EJ", "ET", "L",
        "LA", "LC", "LE", "LF", "LG", "LH", "LK", "LL", "LM", "LP", "LQ",
        "LR", "LS", "LT", "LX", "UC", "UP"
    ],
    "Other Manufactured Products": [
        "AC", "AG", "CF", "CK", "CL", "CN", "CY", "DE", "E", "EA", "EB",
        "EC", "ED", "EH", "EK", "EL", "EM", "EN", "EP", "ES", "F", "FA",
        "FB", "FC", "FE", "FF", "FG", "FK", "FL", "FN", "FP", "FT", "FU",
        "GA", "GB", "GE", "GF", "GJ", "HB", "HR", "LB", "LJ", "M", "MB",
        "ME", "MF", "MG", "MH", "ML", "MN", "MP", "MS", "MT", "NC", "NG",
        "NH", "SC", "UB", "UD", "UE", "UK", "UM", "UN", "VA", "VJ", "VR",
        "WA", "WJ", "WP", "WX", "WY", "XM", "YM", "YN"
    ],
    "Paper Products": [
        "B", "BA", "BB", "BC", "BD", "BF", "BG", "BL", "BM", "BV", "P",
        "PA", "PC", "PD", "S", "SA", "SB", "SD", "SF", "SJ"
    ],
    "Manufactured Fuels, Chemicals and Glasses": [
        "J", "JA", "JB", "JC", "JD", "TE", "VG"
    ],
    "Unclassified": [
        "XE", "XH", "XK", "XS", "XT", "XA", "XB", "XC", "XD", "XG", "XJ",
        "XL", "XN", "XR", "XU"
    ],
    "Construction": [
        "FD", "MJ", "MK", "MM", "MQ", "W", "WB"
    ],
    "Other Procurement": [
        "G", "JH", "JJ", "RF", "RH", "RO", "VB", "VP"
    ],
    "Business Travel": [
        "T", "TA", "TB", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL",
        "TM", "TN", "TP", "TT", "TU", "VC"
    ]
}

    def post(self, request, *args, **kwargs):
        try:
            # 获取前端发送的花费数据
            expenses = request.data  # 示例：{"CA": 100, "WB": 200}

            # 初始化结果字典
            result = {category: {"spend": 0, "carbon_impact": 0} for category in self.CATEGORY_CARBON_IMPACT}
            total_spend = 0
            total_carbon_impact = 0

            # 遍历每个前端传递的花费条目
            for prefix, spend in expenses.items():
                spend = float(spend)  # 转换为浮点数
                matched_categories = []

                # 匹配类别
                for category, prefixes in self.CATEGORY_PREFIX_MAPPING.items():
                    if prefix in prefixes:
                        matched_categories.append(category)

                # 如果找到匹配的类别，则分配花费和计算碳排放
                for category in matched_categories:
                    result[category]["spend"] += spend
                    result[category]["carbon_impact"] += spend * self.CATEGORY_CARBON_IMPACT[category]

            # 计算总花费和总碳排放
            for category, data in result.items():
                total_spend += data["spend"]
                total_carbon_impact += data["carbon_impact"]

            # 构建返回结果
            result["Total"] = {"spend": total_spend, "carbon_impact": total_carbon_impact}
            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)