# Generated by Django 4.2.2 on 2024-04-19 01:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_rooms_admin'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rooms',
            name='isGroupChat',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='rooms',
            name='status',
            field=models.IntegerField(default=1),
        ),
    ]
