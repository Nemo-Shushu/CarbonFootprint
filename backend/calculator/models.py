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
