from django.contrib import admin
from parler.admin import TranslatableAdmin
from website.models import Product, Case_Material, Collection, Surface_Finish, Brand, Color, Blog, Blog_Cates, Subscriber


# customizing admin models
class ProductAdmin(TranslatableAdmin):
    
    prepopulatd_fields = {'slug': ('name',)}
    list_display = ('name', 'tag')
    
# customizing admin models
class BlogAdmin(TranslatableAdmin):
    
    list_display = ('title', 'slug')

    
class CategoryAdmin(TranslatableAdmin):

    list_display = ('name',)


# register models
admin.site.register(Product, ProductAdmin)
admin.site.register(Blog, BlogAdmin)
admin.site.register(Case_Material, CategoryAdmin)
admin.site.register(Blog_Cates, CategoryAdmin)
admin.site.register(Collection, CategoryAdmin)
admin.site.register(Surface_Finish, CategoryAdmin)
admin.site.register(Color, CategoryAdmin)
admin.site.register(Brand, CategoryAdmin)
admin.site.register(Subscriber)