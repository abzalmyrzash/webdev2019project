# Generated by Django 2.2 on 2019-05-13 23:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_post_title'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='group_id',
        ),
    ]
