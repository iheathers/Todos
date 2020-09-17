from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Task(models.Model):
    task_name = models.CharField(max_length=100)    
    date_created = models.DateTimeField(auto_now_add=True)
    is_complete = models.BooleanField(default=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)    

    class Meta:
        ordering = ['-date_created']
        