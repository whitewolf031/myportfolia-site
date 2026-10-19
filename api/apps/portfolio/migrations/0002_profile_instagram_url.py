# Generated for Profile instagram_url

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='instagram_url',
            field=models.CharField(blank=True, default='[Havola]', max_length=255, verbose_name='Instagram'),
        ),
    ]
