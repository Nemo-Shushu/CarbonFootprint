from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    USER_TYPES = (
      (1, 'Normal'),
      (2, 'Researcher'),
      (3, 'Administrator'),
      )

# # Create your models here.
# class Users(AbstractUser):
#     

#     user_role = models.PositiveSmallIntegerField(
#                   choices=USER_TYPES,
#                   null=True
#                   )

#     def __str__(self):
#         return self.username