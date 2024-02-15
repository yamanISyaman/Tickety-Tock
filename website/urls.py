from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("products", views.products_view, name="products"),
    path("products/<str:slug>_<int:id>", views.product_details, name="product-details"),
    path("blogs", views.blogs_view, name="blogs"),
    path("blogs/<str:slug>_<int:id>", views.blog_detail, name="blog-detail"),
    path("subscribe", views.subscribe, name="subscribe"),
    path("contact", views.contact_view, name="contact"),
    path("email", views.email, name="email"),
]
