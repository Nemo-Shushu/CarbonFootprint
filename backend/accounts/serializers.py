from rest_framework import serializers
from .models import User, University
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
    )
     
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    ) 
    
    
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = (
            'username', 
            'password', 
            'password2', 
            'email', 
            'institute', 
            'research_field',
            'first_name',
            'last_name',
        )
    
    def validate(self, attrs):
        for key, value in attrs.items():
            if value is None:
                raise serializers.ValidationError(f"{key} is Empty. Please fill in the field")
                    
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        return attrs
    
    def validate_email(self, value):
        if not value.lower().endswith('.ac.uk'):
            raise serializers.ValidationError("Email must belong to an educational institution (.ac.uk).")
        return value
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value
    
    def validate_institute(self, value):
        if not value.lower().endswith('.ac.uk'):
            raise serializers.ValidationError("Email must belong to an educational institution (.ac.uk).")
        return value
    
    def validate_research_field(self, value):
        if not value.lower().endswith('.ac.uk'):
            raise serializers.ValidationError("Email must belong to an educational institution (.ac.uk).")
        return value
    
    
    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            institute=validated_data.get('institute', ''),
            research_field=validated_data.get('research_field', ''),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


