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
class Surface_Finish(TranslatableModel):

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
    slug = models.SlugField(unique=True)
    image = models.ImageField(_('Image'), upload_to='products')
    brand = models.ForeignKey(Brand, verbose_name=_('Brand'), related_name=_('Products'), on_delete=models.CASCADE)
    material = models.ManyToManyField(Case_Material, verbose_name=_('Case_Material'), related_name=_('Products'), blank=True)
    surface_finish = models.ManyToManyField(Surface_Finish, verbose_name=_('Surface_Finishes'), related_name=_('Products'), blank=True)
    collection = models.ForeignKey(Collection, verbose_name=_('Collection'), related_name=_('Products'), on_delete=models.PROTECT)
    color = models.ManyToManyField(Color, verbose_name=_('Color'), related_name=_('Products'), blank=True)

    def __str__(self):
        return self.name

    def serialize(self):
        # Return a JSON string of the model instance
        return {
            "id": self.id,
            "slug": self.slug,
            "name": self.name,
            "tag": self.tag,
            "image": self.image.url,
            "summary": self.summary,
            "desc": self.desc,
            "spf": self.spf,
        }

    
# blog categories
class Blog_Cates(TranslatableModel):

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
    
    
# blogs object model
class Blog(TranslatableModel):
    
    # fields that need translation
    translations = TranslatedFields(
        title = models.CharField(_('Title'), max_length=1000),
        content = models.TextField(_('Content')),
    )
    
    slug = models.SlugField(unique=True)
    image = models.ImageField(_('Image'), upload_to='blogs')
    category = models.ManyToManyField(Blog_Cates, verbose_name=_('Category'), related_name=_('Blog'), blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    
    def __str__(self):
        return self.title

    def serialize(self):
        # Return a JSON string of the model instance
        return {
            "id": self.id,
            "slug": self.slug,
            "title": self.title,
            "image": self.image.url,
            "summary": self.content[:500],
            "content": self.content,
            "category": [c.serialize() for c in self.category.all()]
        }
    
    
class Subscriber(models.Model):
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.email