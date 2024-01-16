from django.db import models
from parler.models import TranslatableModel, TranslatedFields
from django.utils.translation import gettext_lazy as _



# Materials Model
class Case_Material(TranslatableModel):

    translations = TranslatedFields(
        name = models.CharField(_('Name'), max_length=150)
    )

    def __str__(self):
        return self.name

    def serialize(self):
    # Return a JSON string of the model instance
        return {
            "id": self.id,
            "name": self.name,
        }


# Collection Model
class Collection(TranslatableModel):

    translations = TranslatedFields(
        name = models.CharField(_('Name'), max_length=150)
    )


    def __str__(self):
        return self.name

    def serialize(self):
            return {
                "id": self.id,
                "name": self.name,
            }


# Color Model
class Color(TranslatableModel):

    translations = TranslatedFields(
        name = models.CharField(_('Name'), max_length=150)
    )


    def __str__(self):
        return self.name

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }


# Surface finishes Model
class Surface_Finishes(TranslatableModel):

    translations = TranslatedFields(
        name = models.CharField(_('Name'), max_length=150)
    )


    def __str__(self):
        return self.name

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }


# Brands Model
class Brand(TranslatableModel):

    translations = TranslatedFields(
        name = models.CharField(_('Name'), max_length=150)
    )
    
    logo = models.ImageField(_('Logo'), upload_to='brands')


    def __str__(self):
        return self.name

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "logo": self.logo.url,
        }


# product object model
class Product(TranslatableModel):
    
    # fields that need translation
    translations = TranslatedFields(
        desc = models.CharField(_('Description'), max_length=1000),
        spf = models.CharField(_('Specifications'), max_length=1000),
        summary = models.CharField(_('summary'), max_length=500),
        tag = models.CharField(_('Tag'), max_length=20, blank=True)
    )
    
    name = models.CharField(_('Name'), max_length=150)
    slug = models.SlugField()
    image = models.ImageField(_('Image'), upload_to='products')
    brand = models.ManyToManyField(Brand, verbose_name=_('Brand'), related_name=_('Products'), blank=True)
    material = models.ManyToManyField(Case_Material, verbose_name=_('Case_Material'), related_name=_('Products'), blank=True)
    surface_finishes = models.ManyToManyField(Surface_Finishes, verbose_name=_('Surface_finishes'), related_name=_('Products'), blank=True)
    collection = models.ManyToManyField(Collection, verbose_name=_('Collection'), related_name=_('Products'), blank=True)
    Color = models.ManyToManyField(Color, verbose_name=_('Color'), related_name=_('Products'), blank=True)

    def __str__(self):
        return self.name

    def serialize(self):
        # Return a JSON string of the model instance
        return {
            "id": self.id,
            "name": self.name,
            "tag": self.tag,
            "image": self.image.url,
            "summary": self.summary,
            "desc": self.desc,
            "spf": self.spf,
        }