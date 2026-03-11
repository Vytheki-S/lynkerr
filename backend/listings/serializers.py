from django.utils import timezone
from rest_framework import serializers

from .models import Listing


class ListingSerializer(serializers.ModelSerializer):
    creator_name = serializers.SerializerMethodField()
    time_ago = serializers.SerializerMethodField()
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Listing
        fields = [
            'id', 'user', 'title', 'location', 'image_url',
            'description', 'price', 'created_at', 'updated_at',
            'creator_name', 'time_ago',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'creator_name', 'time_ago']

    def get_creator_name(self, obj):
        return obj.user.username

    def get_time_ago(self, obj):
        now = timezone.now()
        diff = now - obj.created_at
        seconds = int(diff.total_seconds())

        if seconds < 60:
            return 'just now'
        minutes = seconds // 60
        if minutes < 60:
            return f'{minutes} minute{"s" if minutes != 1 else ""} ago'
        hours = minutes // 60
        if hours < 24:
            return f'{hours} hour{"s" if hours != 1 else ""} ago'
        days = hours // 24
        if days < 30:
            return f'{days} day{"s" if days != 1 else ""} ago'
        months = days // 30
        return f'{months} month{"s" if months != 1 else ""} ago'
