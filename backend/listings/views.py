from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Listing
from .serializers import ListingSerializer
from .permissions import IsOwnerOrReadOnly


class ListingListCreateView(generics.ListCreateAPIView):
    serializer_class   = ListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends    = [filters.SearchFilter]
    search_fields      = ['title', 'location']

    def get_queryset(self):
        return Listing.objects.select_related('user').order_by('-created_at')


class ListingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Listing.objects.select_related('user')
    serializer_class   = ListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
