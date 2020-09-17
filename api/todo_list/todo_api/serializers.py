from rest_framework import serializers
from .models import Task
from django.contrib.auth.models import User

class TaskSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Task
        fields = ['id', 'task_name', 'date_created','is_complete']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])
        return user
        