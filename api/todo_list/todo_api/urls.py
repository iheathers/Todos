from django.urls import path
from . import views

urlpatterns = [
    path('tasks/', views.task_list),
    path('tasks/<int:pk>/', views.task_detail),
    path('accounts/<int:pk>/', views.user_detail),
    path('accounts/register/', views.user_register),
    path('accounts/login/', views.user_login),
]
