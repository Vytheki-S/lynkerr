from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Listing, Like
from .serializers import ListingSerializer
from .permissions import IsOwnerOrReadOnly


class ListingListCreateView(generics.ListCreateAPIView):
    serializer_class   = ListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends    = [filters.SearchFilter]
    search_fields      = ['title', 'location', 'description']

    def get_queryset(self):
        qs = Listing.objects.select_related('user').order_by('-created_at')
        category = self.request.query_params.get('category')
        if category and category != 'all':
            qs = qs.filter(category=category)
        return qs


class ListingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Listing.objects.select_related('user')
    serializer_class   = ListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]


class LikeToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            listing = Listing.objects.get(pk=pk)
        except Listing.DoesNotExist:
            return Response({'error': 'Not found.'}, status=404)

        like, created = Like.objects.get_or_create(
            user=request.user,
            listing=listing,
        )

        if not created:
            like.delete()
            return Response({
                'liked': False,
                'like_count': listing.likes.count(),
            })

        return Response({
            'liked': True,
            'like_count': listing.likes.count(),
        })
