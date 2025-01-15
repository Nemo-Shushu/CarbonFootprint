from rest_framework import generics, status,viewsets

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny
from .models import User
from .serializers import RegisterSerializer,UserSerializer
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated

class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        # Serializer 인스턴스에서 is_valid() 호출
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            # 검증 에러 처리
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CsrfTokenView(APIView):
    permission_classes = (AllowAny,)
    
    @method_decorator(ensure_csrf_cookie)
    def get(self, request, format=None):
        return Response({"detail": "CSRF cookie set"}, status=status.HTTP_200_OK)

class LoginView(APIView):
    permission_classes = (AllowAny,)
    
    def post(self, request, format=None):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({"detail": "Logged in successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = (AllowAny,)
    
    def post(self, request, format=None):
        logout(request)
        return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)

#return user's detail
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
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
        "Air - Economy short-haul, to/from UK": 0.151,
        "Air - Business short-haul, to/from UK": 0.227,
        "Air - Economy long-haul, to/from UK": 0.148,
        "Air - Business long-haul, to/from UK": 0.429,
        "Air - Economy international, to/from non-UK": 0.141,
        "Air - Business international, to/from non-UK": 0.408,
        "Sea - Ferry": 0.113,
        "Land - Car": 0.168,
        "Land - Motorbike": 0.114,
        "Land - Taxis": 0.149,
        "Land - Local Bus": 0.102,
        "Land - Coach": 0.027,
        "Land - National rail": 0.035,
        "Land - International rail": 0.041,
        "Land - Light rail and tram": 0.029
    }

    CARBON_INTENSITY_WASTE = {
        "Mixed recycling": 21.294,
        "General waste": 446.242,
        "Clinical waste": 297.000,
        "Chemical waste": 273.000,
        "Biological waste": 1000.000,
        "WEEE mixed recycling": 21.294
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
            spaces = request.data.get('spaces')  # 包含空间类型数据的数组
            proportion = request.data.get('proportion')  # 项目参与比例
            travel_modes = request.data.get('travel_modes')  # 出行方式数据
            waste_data = request.data.get('waste_data')  # 废弃物数据

            if not spaces or proportion is None or not travel_modes or not waste_data:
                return Response(
                    {'error': 'Spaces, proportion, travel_modes, and waste_data are required.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

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
            for space in spaces:
                space_type = space.get('type')  # 空间类型
                total_area = space.get('total_area')  # Total area (m²)

                if total_area is None:
                    return Response(
                        {'error': f'Missing data for space: {space}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                if space_type in self.BENCHMARK_ELECTRICITY and space_type in self.BENCHMARK_GAS:
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
                if space_type in self.BENCHMARK_WATER:
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
            for mode in travel_modes:
                mode_name = mode.get('mode')  # 出行方式
                distance = mode.get('distance')  # 距离

                if mode_name not in self.CARBON_INTENSITY_TRAVEL:
                    return Response(
                        {'error': f'Invalid travel mode: {mode_name}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                if distance is None or distance < 0:
                    return Response(
                        {'error': f'Invalid distance for mode: {mode_name}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                carbon_intensity = self.CARBON_INTENSITY_TRAVEL[mode_name]
                emissions = distance * carbon_intensity
                total_travel_emissions += emissions

                travel_results.append({
                    'mode': mode_name,
                    'distance': distance,
                    'emissions': round(emissions, 2)
                })

            # 废弃物计算
            for waste in waste_data:
                waste_type = waste.get('type')  # 废弃物类型
                amount = waste.get('amount')  # 数量（吨）

                if waste_type not in self.CARBON_INTENSITY_WASTE:
                    return Response(
                        {'error': f'Invalid waste type: {waste_type}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                if amount is None or amount < 0:
                    return Response(
                        {'error': f'Invalid amount for waste type: {waste_type}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                carbon_intensity = self.CARBON_INTENSITY_WASTE[waste_type]
                emissions = amount * carbon_intensity
                total_waste_emissions += emissions

                waste_results.append({
                    'type': waste_type,
                    'amount': amount,
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
                        'total_emissions': round(total_water_emissions, 2)
                    },
                    'travel': {
                        'results': travel_results,
                        'total_emissions': round(total_travel_emissions, 2)
                    },
                    'waste': {
                        'results': waste_results,
                        'total_emissions': round(total_waste_emissions, 2)
                    }
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)