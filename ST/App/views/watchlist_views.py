# App/views/watchlist_views.py

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse
from App.models import Product, WatchList


@login_required
def add_to_watchlist(request, product_id):
    """اضافه کردن محصول به لیست تماشا"""
    product = get_object_or_404(Product, id=product_id)

    # بررسی اینکه آیا قبلاً اضافه شده
    watchlist_item, created = WatchList.objects.get_or_create(
        user=request.user,
        product=product,
        defaults={'status': 'planning'}
    )

    if created:
        messages.success(request, f'"{product.Pname}" به لیست تماشای شما اضافه شد.')
    else:
        messages.info(request, f'"{product.Pname}" قبلاً در لیست تماشای شما وجود دارد.')

    # برگشت به صفحه قبلی یا صفحه جزئیات محصول
    referer = request.META.get('HTTP_REFERER')
    if referer:
        return redirect(referer)
    return redirect('App:product_detail', product_id=product.id)


@login_required
def remove_from_watchlist(request, product_id):
    """حذف محصول از لیست تماشا"""
    product = get_object_or_404(Product, id=product_id)
    watchlist_item = WatchList.objects.filter(user=request.user, product=product).first()

    if watchlist_item:
        watchlist_item.delete()
        messages.success(request, f'"{product.Pname}" از لیست تماشای شما حذف شد.')
    else:
        messages.warning(request, f'"{product.Pname}" در لیست تماشای شما وجود ندارد.')

    referer = request.META.get('HTTP_REFERER')
    if referer:
        return redirect(referer)
    return redirect('App:product_detail', product_id=product.id)


@login_required
def update_watchlist_status(request, product_id):
    """به‌روزرسانی وضعیت محصول در لیست تماشا"""
    product = get_object_or_404(Product, id=product_id)
    watchlist_item = WatchList.objects.filter(user=request.user, product=product).first()

    if request.method == 'POST':
        new_status = request.POST.get('status')
        if watchlist_item and new_status in ['watching', 'completed', 'planning', 'favorite']:
            watchlist_item.status = new_status
            watchlist_item.save()
            messages.success(request,
                             f'وضعیت "{product.Pname}" به "{dict(WatchList.STATUS_CHOICES).get(new_status, new_status)}" تغییر کرد.')

    referer = request.META.get('HTTP_REFERER')
    if referer:
        return redirect(referer)
    return redirect('App:product_detail', product_id=product.id)


@login_required
def watchlist_page(request):
    """صفحه لیست تماشای کاربر"""
    watchlist_items = WatchList.objects.filter(user=request.user).select_related('product')

    # گروه‌بندی بر اساس وضعیت
    watching = watchlist_items.filter(status='watching')
    completed = watchlist_items.filter(status='completed')
    planning = watchlist_items.filter(status='planning')
    favorites = watchlist_items.filter(status='favorite')

    context = {
        'watching': watching,
        'completed': completed,
        'planning': planning,
        'favorites': favorites,
        'total_count': watchlist_items.count(),
    }
    return render(request, 'watchlist.html', context)
