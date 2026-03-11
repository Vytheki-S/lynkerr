from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0002_like'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='category',
            field=models.CharField(
                choices=[
                    ('adventure', 'Adventure'),
                    ('culture', 'Culture'),
                    ('food', 'Food'),
                    ('nature', 'Nature'),
                    ('hiking', 'Hiking'),
                    ('night', 'Night'),
                    ('water', 'Water'),
                    ('history', 'History'),
                ],
                default='adventure',
                max_length=20,
                db_index=True,
            ),
        ),
        migrations.AddField(
            model_name='listing',
            name='rating',
            field=models.DecimalField(blank=True, decimal_places=1, max_digits=3, null=True),
        ),
    ]
