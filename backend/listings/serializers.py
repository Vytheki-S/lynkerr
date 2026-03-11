from rest_framework import serializers

from .models import Listing


class ListingSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='user.username', read_only=True)
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'location', 'image_url', 'description',
            'price', 'category', 'rating', 'created_at', 'updated_at',
            'owner_username', 'like_count', 'is_liked',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'owner_username', 'like_count', 'is_liked']

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
