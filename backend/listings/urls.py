from django.urls import path

from .views import ListingListCreateView, ListingRetrieveUpdateDestroyView, LikeToggleView

urlpatterns = [
    path('listings/',                    ListingListCreateView.as_view()),
    path('listings/<int:pk>/',           ListingRetrieveUpdateDestroyView.as_view()),
    path('listings/<int:pk>/like/',      LikeToggleView.as_view()),
]
