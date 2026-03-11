from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Listing
from .serializers import ListingSerializer
from .permissions import IsOwnerOrReadOnly


class ListingListCreateView(generics.ListCreateAPIView):
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Listing.objects.all().select_related('user')
        search = self.request.query_params.get('search', '').strip()
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(location__icontains=search)
            )
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all().select_related('user')
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
