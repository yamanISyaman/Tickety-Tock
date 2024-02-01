import json
import os
from django.db import IntegrityError
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.core.mail import send_mail
from django.conf import settings
from .models import Product, Case_Material, Color, Surface_Finish, Collection, Brand, Blog, Blog_Cates, Subscriber
# Create your views here.

# homepage view
def index(request):
    return render(request, 'website/index.html')


# products page view
@csrf_exempt
def products_view(request):

    lang = request.LANGUAGE_CODE
    if request.method == "POST":

        data = json.loads(request.body)
        filter = data["filter"]
        
        page = data["page"]
        search_word = filter.pop('search')

        filter_kargs = {k + '__id__in': v for k, v in filter.items()}


        products = Product.objects.language(lang).filter(name__contains=search_word, **filter_kargs).distinct().order_by('id')


        # make a paginator
        pg = Paginator(products, 1)
        
        p = pg.page(page)

        serialized_products = [product.serialize() for product in p.object_list]


        return JsonResponse({
            "has_next": p.has_next(),
            "has_prev": p.has_previous(),
            "num_pages": pg.num_pages,
            "page": page,
            "products": serialized_products
        }, status=201)
    

    return render(request, 'website/products.html', {
        "brands": Brand.objects.language(lang).all(),
        "materials": Case_Material.objects.language(lang).all(),
        "colors": Color.objects.all(),
        "surface_finishes": Surface_Finish.objects.language(lang).all(),
        "collections": Collection.objects.language(lang).all(),
    })



# product details view
def product_details(request, slug, id):
    product = Product.objects.language(request.LANGUAGE_CODE).get(id=id, slug=slug)
    sproducts = Product.objects.language(request.LANGUAGE_CODE).order_by('id').filter(brand=product.brand).exclude(id=id)[0:4]
    return render(request, 'website/product-detail.html', {"product": product, "sproducts": sproducts})


# blogs page view
@csrf_exempt
def blogs_view(request):
    
    lang = request.LANGUAGE_CODE
    if request.method == "POST":

        data = json.loads(request.body)
        filter = data["filter"]
        
        page = data["page"]
        search_word = filter.pop('search')

        filter_kargs = {k + '__id__in': v for k, v in filter.items()}

        blogs = Blog.objects.language(lang).filter(translations__title__contains=search_word, **filter_kargs).distinct().order_by('id')


        # make a paginator
        pg = Paginator(blogs, 1)
        
        p = pg.page(page)

        serialized_blogs = [blog.serialize() for blog in p.object_list]


        return JsonResponse({
            "has_next": p.has_next(),
            "has_prev": p.has_previous(),
            "num_pages": pg.num_pages,
            "page": page,
            "blogs": serialized_blogs,
        }, status=201)
    

    return render(request, 'website/blog.html', {
        "categories": Blog_Cates.objects.language(lang).all(),})


# blog details view
def blog_detail(request, slug, id):
    
    post = Blog.objects.language(request.LANGUAGE_CODE).get(id=id, slug=slug)
    sposts = Blog.objects.language(request.LANGUAGE_CODE).all().order_by('created_at')[:5]
    
    return render(request, "website/blog-detail.html", {"post": post, "sposts": sposts})


def email(request):    
    subject = 'Thank you for registering to our site'
    message = ' it  means a world to us '
    email_from = settings.EMAIL_HOST_USER
    recipient_list = []   
    send_mail( subject, message, email_from, recipient_list )  
    return redirect('index')


@csrf_exempt
def subscribe(request):
    if request.method == "POST":
        
        print(request.body)

        data = json.loads(request.body)

        email = data['email']

        shalf = email.split('@')
        if shalf[0] == "" or len(shalf) != 2 or shalf[1].count('.') != 1:

            return JsonResponse({
                "message": "invalid email",
                "status": "danger"
            })

        s = Subscriber(email=email)

        try:
            s.save()
        except IntegrityError: 
            return JsonResponse({
                "message": "you have already registered our newsletter",
                "status": "danger"
            }, status=403)

        subject = 'Thank you for registering to our newsletter'
        message = ' it  means a world to us '
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [email,]   
        send_mail( subject, message, email_from, recipient_list ) 

        return JsonResponse({"message": "Thanks for subscribing to our Newsletter", "status": "success"}, status=201)
    else:
        return redirect("index")
    
    
def contact_view(request):
    if request.method == "POST":
        print(request.POST['email'])
        data = request.POST
        
        send_mail(
            f"Tickety Tock Contact message from {data['username']}",
            f"from: {data['username']}, email: {data['email']}\n Subject: {data['subject']}\n Message: {data['message']}", 
            settings.EMAIL_HOST_USER, 
            [os.environ['EMAIL_ADMIN'],])
        return redirect(request.path)
        
    return render(request, "website/contact.html")