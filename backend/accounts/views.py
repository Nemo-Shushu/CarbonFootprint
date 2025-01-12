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
    
class ProportionCalculationView(APIView):
    permission_classes = (AllowAny,)
    """
    API View to calculate the proportion of the research group working on a project.
    """

    def post(self, request, *args, **kwargs):
        try:
            # 获取输入数据
            total_fte = request.data.get('total_fte_members')
            fte_on_project = request.data.get('fte_staff_on_project')

            # 验证输入数据
            if total_fte is None or fte_on_project is None:
                return Response(
                    {'error': 'Both total_fte_members and fte_staff_on_project are required.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if total_fte == 0:
                return Response(
                    {'error': 'Total FTE members (a) cannot be zero.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # 计算比例
            proportion = fte_on_project / total_fte

            # 返回计算结果
            return Response(
                {
                    'total_fte_members': total_fte,
                    'fte_staff_on_project': fte_on_project,
                    'proportion': proportion
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ConsumptionAndEmissionsView(APIView):
    permission_classes = (AllowAny,)
    """
    API View to calculate electricity and gas consumption, and total emissions for different space types.
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

    # 预设的 Carbon intensity 和 Transmission & distribution
    ELECTRICITY_GRID_INTENSITY = 0.212
    ELECTRICITY_TRANSMISSION_DISTRIBUTION = 0.019

    GAS_CARBON_INTENSITY = 0.183
    GAS_TRANSMISSION_DISTRIBUTION = 0.0188

    def post(self, request, *args, **kwargs):
        try:
            # 获取请求数据
            spaces = request.data.get('spaces')  # 包含空间类型数据的数组
            proportion = request.data.get('proportion')  # 项目参与比例

            if not spaces or proportion is None:
                return Response(
                    {'error': 'Spaces data and proportion are required.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            results = []
            total_emissions = 0  # 综合排放总量

            for space in spaces:
                # 提取数据
                space_type = space.get('type')  # 空间类型
                total_area = space.get('total_area')  # Total area (m²)

                # 验证输入数据完整性
                if space_type not in self.BENCHMARK_ELECTRICITY or space_type not in self.BENCHMARK_GAS:
                    return Response(
                        {'error': f'Invalid space type: {space_type}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                if total_area is None:
                    return Response(
                        {'error': f'Missing data for space: {space}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # 获取对应的 Benchmark 值
                benchmark_electricity = self.BENCHMARK_ELECTRICITY[space_type]
                benchmark_gas = self.BENCHMARK_GAS[space_type]

                # 计算 Electricity consumption (kWh)
                electricity_consumption = total_area * benchmark_electricity * proportion
                electricity_emissions = electricity_consumption * (
                    self.ELECTRICITY_GRID_INTENSITY + self.ELECTRICITY_TRANSMISSION_DISTRIBUTION
                )

                # 计算 Gas consumption (kWh)
                gas_consumption = total_area * benchmark_gas * proportion
                gas_emissions = gas_consumption * (
                    self.GAS_CARBON_INTENSITY + self.GAS_TRANSMISSION_DISTRIBUTION
                )

                # 总排放量累加
                total_emissions += electricity_emissions + gas_emissions

                # 保存计算结果
                results.append({
                    'type': space_type,
                    'electricity_consumption': round(electricity_consumption, 2),
                    'electricity_emissions': round(electricity_emissions, 2),
                    'gas_consumption': round(gas_consumption, 2),
                    'gas_emissions': round(gas_emissions, 2),
                    'total_emissions': round(electricity_emissions + gas_emissions, 2)
                })

            # 返回结果
            return Response(
                {
                    'results': results,
                    'total_emissions': round(total_emissions, 2)
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class WaterConsumptionView(APIView):
    permission_classes = (AllowAny,)
    """
    API View to calculate water consumption and total emissions for different space types.
    """

    # 预设的 Benchmark water consumption
    BENCHMARK_WATER = {
        "Physical sciences laboratory": 1.7,
        "Medical/Life sciences laboratory": 1.4,
        "Engineering laboratory": 1.7,
        "Office/Admin space": 1.0
    }

    # 预设的 Carbon intensity
    WATER_CONSUMPTION_CARBON_INTENSITY = 0.149
    WATER_TREATMENT_CARBON_INTENSITY = 0.272

    def post(self, request, *args, **kwargs):
        try:
            # 获取请求数据
            spaces = request.data.get('spaces')  # 包含空间类型数据的数组
            proportion = request.data.get('proportion')  # 项目参与比例

            if not spaces or proportion is None:
                return Response(
                    {'error': 'Spaces data and proportion are required.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            results = []
            total_emissions = 0  # 综合排放总量

            for space in spaces:
                # 提取数据
                space_type = space.get('type')  # 空间类型
                total_area = space.get('total_area')  # Total area (m²)

                # 验证输入数据完整性
                if space_type not in self.BENCHMARK_WATER:
                    return Response(
                        {'error': f'Invalid space type for water consumption: {space_type}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                if total_area is None:
                    return Response(
                        {'error': f'Missing data for space: {space}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # 获取对应的 Benchmark 值
                benchmark_water = self.BENCHMARK_WATER[space_type]

                # 计算 Water consumption (m³)
                water_consumption = total_area * benchmark_water * proportion

                # 计算 Water emissions (kg CO2e)
                water_emissions = water_consumption * (
                    self.WATER_CONSUMPTION_CARBON_INTENSITY + self.WATER_TREATMENT_CARBON_INTENSITY
                )

                # 总排放量累加
                total_emissions += water_emissions

                # 保存计算结果
                results.append({
                    'type': space_type,
                    'water_consumption': round(water_consumption, 2),
                    'water_emissions': round(water_emissions, 2)
                })

            # 返回结果
            return Response(
                {
                    'results': results,
                    'total_emissions': round(total_emissions, 2)
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class TravelEmissionsView(APIView):
    permission_classes = (AllowAny,)
    """
    API View to calculate travel emissions for different modes of travel.
    """

    # 固定的 Carbon intensity 数据
    CARBON_INTENSITY = {
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

    def post(self, request, *args, **kwargs):
        try:
            # 获取请求数据
            travel_modes = request.data.get('travel_modes')  # 包含出行方式和距离的数组

            if not travel_modes:
                return Response(
                    {'error': 'Travel modes data is required.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            results = []
            total_emissions = 0  # 综合排放总量

            for mode in travel_modes:
                # 提取数据
                mode_name = mode.get('mode')  # 出行方式
                distance = mode.get('distance')  # 距离

                # 验证输入数据完整性
                if mode_name not in self.CARBON_INTENSITY:
                    return Response(
                        {'error': f'Invalid travel mode: {mode_name}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                if distance is None or distance < 0:
                    return Response(
                        {'error': f'Invalid distance for mode: {mode_name}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # 获取对应的 Carbon intensity
                carbon_intensity = self.CARBON_INTENSITY[mode_name]

                # 计算 Total emissions (kg CO2e)
                emissions = distance * carbon_intensity

                # 累加综合排放量
                total_emissions += emissions

                # 保存计算结果
                results.append({
                    'mode': mode_name,
                    'distance': distance,
                    'emissions': round(emissions, 2)
                })

            # 返回结果
            return Response(
                {
                    'results': results,
                    'total_emissions': round(total_emissions, 2)
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class WasteEmissionsView(APIView):
    permission_classes = (AllowAny,)
    """
    API View to calculate waste emissions for different types of waste.
    """

    # 固定的 Carbon intensity 数据
    CARBON_INTENSITY = {
        "Mixed recycling": 21.294,
        "General waste": 446.242,
        "Clinical waste": 297.000,
        "Chemical waste": 273.000,
        "Biological waste": 1000.000,
        "WEEE mixed recycling": 21.294
    }

    def post(self, request, *args, **kwargs):
        try:
            # 获取请求数据
            waste_data = request.data.get('waste_data')  # 包含废弃物类型和数量的数组

            if not waste_data:
                return Response(
                    {'error': 'Waste data is required.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            results = []
            total_emissions = 0  # 综合排放总量

            for waste in waste_data:
                # 提取数据
                waste_type = waste.get('type')  # 废弃物类型
                amount = waste.get('amount')  # 数量（吨）

                # 验证输入数据完整性
                if waste_type not in self.CARBON_INTENSITY:
                    return Response(
                        {'error': f'Invalid waste type: {waste_type}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                if amount is None or amount < 0:
                    return Response(
                        {'error': f'Invalid amount for waste type: {waste_type}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # 获取对应的 Carbon intensity
                carbon_intensity = self.CARBON_INTENSITY[waste_type]

                # 计算 Total emissions (kg CO2e)
                emissions = amount * carbon_intensity

                # 累加综合排放量
                total_emissions += emissions

                # 保存计算结果
                results.append({
                    'type': waste_type,
                    'amount': amount,
                    'emissions': round(emissions, 2)
                })

            # 返回结果
            return Response(
                {
                    'results': results,
                    'total_emissions': round(total_emissions, 2)
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)