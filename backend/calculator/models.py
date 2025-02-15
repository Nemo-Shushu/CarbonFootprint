from django.db import models
from accounts.models import *

class CalculationRecord(models.Model):
    # 时间戳
    timestamp = models.DateTimeField(auto_now_add=True)

    # 存储所有接收的数据
    input_data = models.JSONField()  # 直接存储接收到的 JSON 数据

    # 存储计算结果
    results = models.JSONField()  # 存储计算后的结果

    # 可选：为某些字段添加额外的注释信息
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Calculation on {self.timestamp}"
    
    

class emission_factors(models.Model):
    category = models.CharField(max_length=255, unique=True)  # 类别名称
    benchmark_electricity = models.FloatField(null=True, blank=True)  # 电力因子
    benchmark_gas = models.FloatField(null=True, blank=True)  # 燃气因子

    def __str__(self):
        return self.category
    
    class Meta:
        db_table = "emission_factors"
        
class ProcurementData(models.Model):
    code = models.CharField(max_length=10, unique=True)
    description_dict = models.JSONField()  # 存储字典类型的数据

    def __str__(self):
        return self.code
    
    class Meta:
        db_table = "calculate_procurement_data"


class CategoryCarbonImpact(models.Model):
    category = models.CharField(max_length=255, unique=True)
    carbon_impact = models.FloatField()

    def __str__(self):
        return self.category
    
    class Meta:
        db_table = "calculate_category_carbon_impact"

class Result(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_electricity_emissions = models.DecimalField(max_digits=10, decimal_places=2)
    total_gas_emissions = models.DecimalField(max_digits=10, decimal_places=2)
    total_water_emissions = models.DecimalField(max_digits=10, decimal_places=2)
    total_travel_emissions = models.DecimalField(max_digits=10, decimal_places=2)
    total_waste_emissions = models.DecimalField(max_digits=10, decimal_places=2)
    total_procurement_emissions = models.DecimalField(max_digits=10, decimal_places=2)
    total_carbon_emissions = models.DecimalField(max_digits=10, decimal_places=2)
    # submitted_user = models.ForeignKey(User)

    class Meta:
        db_table = 'calculate_result'  # 指定数据库表名

class WasteEmission(models.Model):
    id = models.BigAutoField(primary_key=True)  # ID 字段
    type_of_waste = models.CharField(max_length=50, unique=True)  # 废弃物类型（唯一）
    amount = models.FloatField()  # 数量
    carbon_intensity = models.DecimalField(max_digits=10, decimal_places=5, null=True, blank=True)  # 碳排放因子
    total_emissions = models.DecimalField(max_digits=15, decimal_places=5, null=True, blank=True)  # 总碳排放
    submission_id = models.BigIntegerField()  # 提交 ID

    class Meta:
        db_table = "accounts_wasteemission"  # 这里要和数据库里的表名一致

    def __str__(self):
        return f"{self.type_of_waste}: {self.carbon_intensity}"