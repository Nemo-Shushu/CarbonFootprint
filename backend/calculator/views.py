from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import Result, emission_factors
from .models import ProcurementData, CategoryCarbonImpact
from .models import WasteEmission


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
    BENCHMARK_WATER = {
        "Physical sciences laboratory": 1.7,
        "Medical/Life sciences laboratory": 1.4,
        "Engineering laboratory": 1.7,
        "Office/Admin space": 1.0,
    }

    ELECTRICITY_GRID_INTENSITY = 0.212
    ELECTRICITY_TRANSMISSION_DISTRIBUTION = 0.019
    GAS_CARBON_INTENSITY = 0.183
    GAS_TRANSMISSION_DISTRIBUTION = 0.0188
    WATER_CONSUMPTION_CARBON_INTENSITY = 0.149
    WATER_TREATMENT_CARBON_INTENSITY = 0.272

    CARBON_INTENSITY_TRAVEL = {
        "air-eco-short": 0.151,
        "air-business-short": 0.227,
        "air-eco-long": 0.148,
        "air-business-long": 0.429,
        "land-car": 0.168,
        "land-bus": 0.102,
    }

    CARBON_INTENSITY_WASTE = {
        "mixed-recycle": 21.294,
        "general-waste": 446.242,
        "clinical-waste": 297.000,
        "chemical-waste": 273.000,
        "bio-waste": 1000.000,
    }

    def calculate_report_emissions(self, request):
        utilities = request.get("utilities", {})
        travel = request.get("travel", {})
        waste = request.get("waste", {})

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

        # Calculate water, electricity, and gas emissions
        for space_type, area_key in {
            "Academic laboratory": "academic-laboratory-area",
            "Academic office": "academic-office-area",
            "Admin office": "admin-office-area",
        }.items():
            total_area = float(utilities.get(area_key, 0))
            factor = emission_factors.objects.filter(category=space_type).first()
            if total_area and factor:
                total_electricity_emissions += (
                    total_area * factor.benchmark_electricity * proportion * 0.231
                )
                total_gas_emissions += (
                    total_area * factor.benchmark_gas * proportion * 0.201
                )

        for space_type, area_key in {
            "Physical sciences laboratory": "physical-laboratory-area",
            "Medical/Life sciences laboratory": "medical-laboratory-area",
            "Engineering laboratory": "engineering-laboratory-area",
            "Office/Admin space": "admin-space-area",
        }.items():
            total_area = float(utilities.get(area_key, 0))
            if total_area:
                total_water_emissions += (
                    total_area
                    * self.BENCHMARK_WATER[space_type]
                    * proportion
                    * (
                        self.WATER_CONSUMPTION_CARBON_INTENSITY
                        + self.WATER_TREATMENT_CARBON_INTENSITY
                    )
                )

        # Calculate travel carbon emissions
        for mode, distance in travel.items():
            if mode in self.CARBON_INTENSITY_TRAVEL:
                total_travel_emissions += (
                    float(distance) * self.CARBON_INTENSITY_TRAVEL[mode]
                )

        # Calculate waste carbon emissions
        for waste_type, amount in waste.items():
            waste_entry = WasteEmission.objects.filter(type_of_waste=waste_type).first()
            if waste_entry and waste_entry.carbon_intensity is not None:
                try:
                    total_waste_emissions += float(amount) * float(
                        waste_entry.carbon_intensity
                    )  # Convert Decimal to float
                except Exception as e:
                    print(f" Calculate {waste_type} emission error: {str(e)}")  # Debug

        return {
            "total_electricity_emissions": round(total_electricity_emissions, 2),
            "total_gas_emissions": round(total_gas_emissions, 2),
            "total_water_emissions": round(total_water_emissions, 2),
            "total_travel_emissions": round(total_travel_emissions, 2),
            "total_waste_emissions": round(total_waste_emissions, 2),
        }


class ReportView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        try:
            utilities = request.data.get("utilities", {})
            travel = request.data.get("travel", {})
            waste = request.data.get("waste", {})
            procurement = request.data.get("procurement", {})

            if not all(
                isinstance(data, dict)
                for data in [utilities, travel, waste, procurement]
            ):
                return Response(
                    {"error": "Invalid input format"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            report_calculator = ReportcalculateView()
            report_data = report_calculator.calculate_report_emissions(request.data)

            if "error" in report_data:
                return Response(
                    {"error": report_data["error"]}, status=status.HTTP_400_BAD_REQUEST
                )

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

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# @ensure_csrf_cookie
class SubmitView(APIView):
    """
    API for confirming calculation results and storing into database
    """

    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        try:
            # Retrieve request data
            # id = request.data.get("id", {})
            user_id = request.user.id
            print(request.user)
            # user_id = request.data.get("user_id")
            utilities = request.data.get("utilities", {})
            travel = request.data.get("travel", {})
            waste = request.data.get("waste", {})
            procurement = request.data.get("procurement", {})

            # Ensure all data formats are correct
            if not all(
                isinstance(data, dict)
                for data in [utilities, travel, waste, procurement]
            ):
                return Response(
                    {"error": "Invalid input format"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Calculate carbon emissions
            report_calculator = ReportcalculateView()
            report_data = report_calculator.calculate_report_emissions(request.data)

            if "error" in report_data:
                return Response(
                    {"error": report_data["error"]}, status=status.HTTP_400_BAD_REQUEST
                )

            procurement_calculator = ProcurementCalculatorView()
            procurement_data = procurement_calculator.calculate_procurement_emissions(
                procurement
            )
            total_procurement_emissions = sum(
                category_data["carbon_impact"]
                for category_data in procurement_data.values()
            )

            # Calculate total carbon emissions
            total_carbon_emissions = (
                report_data["total_electricity_emissions"]
                + report_data["total_gas_emissions"]
                + report_data["total_water_emissions"]
                + report_data["total_travel_emissions"]
                + report_data["total_waste_emissions"]
                + total_procurement_emissions
            )

            # Store to database
            try:
                # print(request.user)
                result_entry = Result(
                    user_id,
                    total_electricity_emissions=report_data[
                        "total_electricity_emissions"
                    ],
                    total_gas_emissions=report_data["total_gas_emissions"],
                    total_water_emissions=report_data["total_water_emissions"],
                    total_travel_emissions=report_data["total_travel_emissions"],
                    total_waste_emissions=report_data["total_waste_emissions"],
                    total_procurement_emissions=total_procurement_emissions,
                    total_carbon_emissions=total_carbon_emissions,
                )
                result_entry.save()
            except IntegrityError:
                print(str(Exception))
                return Response(
                    {"error": "User already has a stored result"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return Response({"success": True}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
