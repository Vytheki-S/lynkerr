from rest_framework import serializers

from .models import Listing


class ListingSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'location', 'image_url', 'description',
            'price', 'created_at', 'updated_at', 'owner_username',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'owner_username']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
