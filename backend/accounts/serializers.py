from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'email', 'first_name', 'last_name',
            'username', 'institute', 'is_admin',
            'is_researcher', 'is_verified', 'research_field'
        )