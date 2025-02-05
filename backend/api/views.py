import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from accounts.models import University, ResearchField
from rest_framework.response import Response
from .serializers import InstitutionSerializer, ResearchFieldSerializer
def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response


@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    if username is None or password is None:
        return JsonResponse({'detail': 'Please provide username and password.'}, status=400)

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({'detail': 'Invalid credentials.'}, status=400)

    login(request, user)
    return JsonResponse({'detail': 'Successfully logged in.'})


def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)

    logout(request)
    return JsonResponse({'detail': 'Successfully logged out.'})


@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})

    return JsonResponse({'isAuthenticated': True})


def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})

    print(type(request.user))
    user = request.user
    return JsonResponse({
        'isAuthenticated': True,
        'username': user.username,
        'forename': user.first_name,
        'email': user.email,
        'institute': user.institute,
        'research_field': getattr(user, 'research_field', None),  
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def institution_list(request):
    institutions = University.objects.all()
    serializer_class = InstitutionSerializer(institutions, many=True)
    return Response(serializer_class.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def field_list(request):
    fields = ResearchField.objects.all()
    serializer_class = ResearchFieldSerializer(fields , many=True)
    return Response(serializer_class.data)