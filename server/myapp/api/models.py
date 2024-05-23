from django.db import models

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=20)
    email = models.CharField(max_length=50)
    password = models.CharField(max_length=20)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    university = models.CharField(max_length=50)

class File(models.Model):
    #user = models.ForeignKey(User, on_delete=models.CASCADE)
    path = models.CharField(max_length=50)
    num_cells = models.IntegerField(default=0)
    data = models.TextField()