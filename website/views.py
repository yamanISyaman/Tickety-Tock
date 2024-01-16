import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from .models import Product, Case_Material, Color, Surface_Finishes, Collection, Brand
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
        "surface_finishes": Surface_Finishes.objects.language(lang).all(),
        "collections": Collection.objects.language(lang).all(),
    })



# product details view
def product_details(request, name, id):
    return render(request, 'website/product-detail.html')