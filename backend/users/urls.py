from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import RegisterView, LogoutView, UserProfileView, UserListingsView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('users/<str:username>/', UserProfileView.as_view()),
    path('users/<str:username>/listings/', UserListingsView.as_view()),
]
