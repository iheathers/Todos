from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .createToken import get_tokens_for_user
from .models import Task
from .serializers import TaskSerializer, UserSerializer

# Create your views here.

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def task_list(request):
    # List all tasks or create a new task
    if request.method == 'GET':
        tasks = Task.objects.all().filter(owner=request.user).order_by('id')
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():

            task = serializer.save()
            task.owner = request.user
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def task_detail(request, pk):
    # Retrieve, update or delete a task
    try: 
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':        
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        
@api_view(['GET', 'POST'])
def user_detail(request, pk):
    try: 
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({"error": "user not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':        
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def user_register(request):    
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                if user: 
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response({'error': 'User not registered'}, status=status.HTTP_400_BAD_REQUEST)
            except:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def user_login(request):
    # List all tasks or create a new task 
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is None:            
            return Response({'error': 'Username or password are incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        serialized_user = UserSerializer(user).data       
        if serialized_user:           
            token = get_tokens_for_user(user)            
            return Response({"user": serialized_user, "token": token} )
        return Response({'error': "User can't be logged in"}, status=status.HTTP_400_BAD_REQUEST)
        