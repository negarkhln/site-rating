from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from App.models import Product, Rating


@login_required
def rate_product(request, product_id):
    product = get_object_or_404(Product, id=product_id)

    if request.method == 'POST':
        score = int(request.POST.get('score', 0))
        if 1 <= score <= 5:
            rating, created = Rating.objects.update_or_create(
                product=product,
                user=request.user,
                defaults={'score': score}
            )
            messages.success(request, 'امتیاز شما با موفقیت ثبت شد!')
        else:
            messages.error(request, 'امتیاز باید بین 1 تا 5 باشد')

    return redirect('App:product_detail', product_id=product.id)  # <-- اضافه کردن App:
