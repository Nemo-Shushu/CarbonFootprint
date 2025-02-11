from django.db import models

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
        db_table = "procurement_data"


class CategoryCarbonImpact(models.Model):
    category = models.CharField(max_length=255, unique=True)
    carbon_impact = models.FloatField()

    def __str__(self):
        return self.category
    
    class Meta:
        db_table = "category_carbon_impact"
