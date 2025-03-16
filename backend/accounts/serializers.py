from rest_framework import serializers
from .models import User, ConversionFactor, University, ResearchField
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        error_messages={"blank": "Email is empty. Please fill in the field."},
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="A user with this email already exists.",
            )
        ],
    )

    username = serializers.CharField(
        required=True,
        error_messages={"blank": "Username is empty. Please fill in the field."},
    )

    first_name = serializers.CharField(
        required=True,
        error_messages={"blank": "first name is empty. Please fill in the field."},
    )

    last_name = serializers.CharField(
        required=True,
        error_messages={"blank": "last name is empty. Please fill in the field."},
    )

    institute = serializers.SlugRelatedField(
        slug_field="name",
        queryset=University.objects.all(),
        required=True,
        error_messages={"null": "Instutution is empty. Please fill in the field."},
    )

    research_field = serializers.SlugRelatedField(
        slug_field="name",
        queryset=ResearchField.objects.all(),
        required=True,
        error_messages={"null": "Research Field is empty. Please fill in the field."},
    )

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={"input_type": "password"},
        error_messages={"blank": "Password is empty. Please fill in the field."},
    )

    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        error_messages={
            "blank": "Password confirmation is empty. Please fill in the field."
        },
    )

    class Meta:
        model = User
        fields = (
            "username",
            "password",
            "password2",
            "email",
            "institute",
            "research_field",
            "first_name",
            "last_name",
        )

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        return attrs

    def validate_email(self, value):
        if not value.lower().endswith(".ac.uk"):
            raise serializers.ValidationError(
                "Email must belong to an educational institution (.ac.uk)."
            )
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "A user with this username already exists."
            )
        return value


class ConversionFactorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConversionFactor
        fields = "__all__"


class CreateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        error_messages={"blank": "Email is empty. Please fill in the field."},
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="A user with this email already exists.",
            )
        ],
    )

    username = serializers.CharField(
        required=True,
        error_messages={"blank": "Username is empty. Please fill in the field."},
    )

    first_name = serializers.CharField(
        required=True,
        error_messages={"blank": "first name is empty. Please fill in the field."},
    )

    last_name = serializers.CharField(
        required=True,
        error_messages={"blank": "last name is empty. Please fill in the field."},
    )

    institute = serializers.SlugRelatedField(
        slug_field="name",
        queryset=University.objects.all(),
        required=True,
        error_messages={"null": "Instutution is empty. Please fill in the field."},
    )

    research_field = serializers.SlugRelatedField(
        slug_field="name",
        queryset=ResearchField.objects.all(),
        required=True,
        error_messages={"null": "Research Field is empty. Please fill in the field."},
    )

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={"input_type": "password"},
        error_messages={"blank": "Password is empty. Please fill in the field."},
    )

    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        error_messages={
            "blank": "Password confirmation is empty. Please fill in the field."
        },
    )

    class Meta:
        model = User
        fields = (
            "username",
            "password",
            "password2",
            "email",
            "institute",
            "research_field",
            "first_name",
            "last_name",
        )

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        return attrs

    def validate_email(self, value):
        if not value.lower().endswith(".ac.uk"):
            raise serializers.ValidationError(
                "Email must belong to an educational institution (.ac.uk)."
            )
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "A user with this username already exists."
            )
        return value

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            institute=validated_data.get("institute", ""),
            research_field=validated_data.get("research_field", ""),
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class UpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    institute = serializers.SlugRelatedField(
        slug_field="name",
        queryset=University.objects.all(),
        required=False,
        allow_null=True,
    )
    research_field = serializers.SlugRelatedField(
        slug_field="name",
        queryset=ResearchField.objects.all(),
        required=False,
        allow_null=True,
    )
    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        validators=[validate_password],
        style={"input_type": "password"},
    )
    password2 = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = (
            "password",
            "password2",
            "institute",
            "research_field",
            "first_name",
            "last_name",
        )

    def validate(self, attrs):
        password = attrs.get("password", "")
        password2 = attrs.get("password2", "")
        if password or password2:
            if password != password2:
                raise serializers.ValidationError(
                    {"password": "Password fields didn't match."}
                )
        return attrs

    def update(self, instance, validated_data):
        if "first_name" in validated_data:
            if validated_data["first_name"].strip():
                instance.first_name = validated_data["first_name"]
        if "last_name" in validated_data:
            if validated_data["last_name"].strip():
                instance.last_name = validated_data["last_name"]
        if "institute" in validated_data:
            if validated_data["institute"]:
                instance.institute = validated_data["institute"]
        if "research_field" in validated_data:
            if validated_data["research_field"]:
                instance.research_field = validated_data["research_field"]
        password = validated_data.get("password")
        if password and password.strip():
            instance.set_password(password)
        instance.save()
        return instance
