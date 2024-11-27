from django import forms
from django.contrib.auth.forms import UserCreationForm


class UserForm(UserCreationForm):
    email = forms.EmailField(required=True, label='email')

    class Meta:
        model = 'accounts.User'
        fields = ('username', 'foreName', 'surName', 'isAdmin','email', 'institute', 'password1')
        labels = {
            'username': 'User_name',
            'email': 'Email',
            'foreName' :'Forename',
            'surName' : 'Surname',
            'institute' : 'Institute',
            'password1': 'Password',
            'password2': 'Confirmation',
        }

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if 'accounts.User'.objects.filter(email=email).exists():
            raise forms.ValidationError("A duplicated Email.")
        return email