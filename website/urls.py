from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('products', views.products_view, name="products"), 
    path('products/<str:name>_<int:id>', views.product_details, name="product-details"),
]