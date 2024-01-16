from django.contrib import admin
from parler.admin import TranslatableAdmin
from website.models import Product, Case_Material, Collection, Surface_Finishes, Brand, Color


# customizing admin models
class ProductAdmin(TranslatableAdmin):
    
    list_display = ('name', 'tag')
    prepopulatd_fields = {'slug': 'name',}


class CategoryAdmin(TranslatableAdmin):

    list_display = ('name',)


# register models
admin.site.register(Product, ProductAdmin)
admin.site.register(Case_Material, CategoryAdmin)
admin.site.register(Collection, CategoryAdmin)
admin.site.register(Surface_Finishes, CategoryAdmin)
admin.site.register(Color, CategoryAdmin)
admin.site.register(Brand, CategoryAdmin)