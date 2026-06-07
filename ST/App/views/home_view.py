from django.shortcuts import render
from App.models import Product

def home(request):
    products = Product.objects.all().order_by('-weighted_rating')[:5]
    return render(request, 'home.html', {'products': products})