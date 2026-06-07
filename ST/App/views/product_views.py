from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q, F
from django.http import HttpResponseRedirect
from App.models import Product, Rating, Category, WatchList


def product_list(request):
    products = Product.objects.all()
    categories = Category.objects.all()

    # دریافت پارامترها
    search_query = request.GET.get('search', '').strip()
    min_rating = request.GET.get('min_rating', '')
    sort_by = request.GET.get('sort_by', '')
    category_slug = request.GET.get('category', '')

    # دریافت پارامترهای الگوریتم‌های مرتب‌سازی و جستجو (برای پروژه تست)
    sort_algorithm = request.GET.get('sort_algorithm', 'default')
    search_algorithm = request.GET.get('search_algorithm', 'default')

    # فیلتر بر اساس دسته‌بندی
    selected_category = None
    if category_slug:
        selected_category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=selected_category)

    # جستجو
    if search_query:
        products = products.filter(
            Q(Pname__icontains=search_query)
        )

    # فیلتر حداقل امتیاز
    if min_rating:
        try:
            min_rating = float(min_rating)
            products = products.filter(weighted_rating__gte=min_rating)
        except ValueError:
            pass

    # ========== مرتب‌سازی با الگوریتم‌های مختلف (برای پروژه تست) ==========
    products_list = list(products)  # تبدیل به لیست برای الگوریتم‌های دستی

    if sort_algorithm == 'quick_sort' and products_list:
        from App.utils.sorting import SortingAlgorithms
        products_list = SortingAlgorithms.quick_sort(products_list, key='weighted_rating', reverse=True)
        products = products_list
    elif sort_algorithm == 'merge_sort' and products_list:
        from App.utils.sorting import SortingAlgorithms
        products_list = SortingAlgorithms.merge_sort(products_list, key='weighted_rating', reverse=True)
        products = products_list
    elif sort_algorithm == 'heap_sort' and products_list:
        from App.utils.sorting import SortingAlgorithms
        products_list = SortingAlgorithms.heap_sort(products_list, key='weighted_rating', reverse=True)
        products = products_list
    else:
        # مرتب‌سازی پیش‌فرض با ORM
        if sort_by == 'name_asc':
            products = products.order_by('Pname')
        elif sort_by == 'name_desc':
            products = products.order_by('-Pname')
        elif sort_by == 'rating_asc':
            products = products.order_by('weighted_rating')
        elif sort_by == 'rating_desc':
            products = products.order_by('-weighted_rating')
        elif sort_by == 'newest':
            products = products.order_by('-id')
        else:
            products = products.order_by('-weighted_rating')

    return render(request, 'product_list.html', {
        'products': products,
        'categories': categories,
        'selected_category': selected_category,
        'search_query': search_query,
        'min_rating': min_rating,
        'sort_by': sort_by,
        'total_count': Product.objects.count(),
        # اضافه کردن برای پروژه تست
        'sort_algorithm': sort_algorithm,
        'search_algorithm': search_algorithm,
    })


def product_detail(request, product_id):
    product = get_object_or_404(Product, id=product_id)

    # افزایش تعداد بازدید
    product.views_count += 1
    product.save(update_fields=['views_count'])

    user_rating = None
    watchlist_item = None

    if request.user.is_authenticated:
        user_rating = Rating.objects.filter(product=product, user=request.user).first()
        watchlist_item = WatchList.objects.filter(user=request.user, product=product).first()

    # گرفتن نظرات فعال
    comments = product.comments.filter(is_active=True)

    return render(request, 'product_detail.html', {
        'product': product,
        'user_rating': user_rating,
        'comments': comments,
        'watchlist_item': watchlist_item,  # اضافه کن
    })


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

    return redirect('App:product_detail', product_id=product.id)


def download_product(request, product_id):
    product = get_object_or_404(Product, id=product_id)

    # افزایش تعداد دانلود
    product.download_count += 1
    product.save(update_fields=['download_count'])

    # اگر فایل آپلود شده باشد
    if product.download_file:
        return HttpResponseRedirect(product.download_file.url)

    # اگر لینک دانلود وجود داشته باشد
    elif product.download_url:
        return HttpResponseRedirect(product.download_url)

    else:
        messages.error(request, 'لینک دانلود برای این محصول وجود ندارد')
        return redirect('App:product_detail', product_id=product.id)
