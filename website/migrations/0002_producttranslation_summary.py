# Generated by Django 3.2.23 on 2024-01-16 08:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='producttranslation',
            name='summary',
            field=models.CharField(default='fdfd fd f dsf d f s d', max_length=500, verbose_name='summary'),
            preserve_default=False,
        ),
    ]