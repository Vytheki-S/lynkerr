from django.db import models
from django.contrib.auth.models import User


class Listing(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    title = models.CharField(max_length=200)
    location = models.CharField(max_length=200, db_index=True)
    image_url = models.TextField()
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
