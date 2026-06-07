# App/views/dashboard_views.py

from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Count, Avg, Sum, Q
from django.utils import timezone
from datetime import timedelta
from App.models import Product, Rating, Comment, UserProfile, Category
from django.contrib.auth.models import User


@staff_member_required
def admin_dashboard(request):
    """
    داشبورد مدیریتی با آمار کامل
    فقط کاربران ادمین (staff) می‌توانند دسترسی داشته باشند
    """

    # ========== آمار پایه ==========
    total_products = Product.objects.count()
    total_movies = Product.objects.filter(category__name='فیلم').count()
    total_series = Product.objects.filter(category__name='سریال').count()
    total_categories = Category.objects.count()

    # ========== آمار کاربران ==========
    total_users = User.objects.count()
    staff_users = User.objects.filter(is_staff=True).count()
    regular_users = total_users - staff_users

    # کاربران قدیمی و جدید (محاسبه دستی چون is_old_user property است)
    all_profiles = UserProfile.objects.all()
    old_users = sum(1 for p in all_profiles if p.is_old_user)
    new_users = len(all_profiles) - old_users

    # کاربران فعال (کسانی که حداقل یک لاگین داشته‌اند)
    active_users = UserProfile.objects.filter(login_count__gt=0).count()

    # ========== آمار امتیازات ==========
    total_ratings = Rating.objects.count()
    avg_rating = Rating.objects.aggregate(Avg('score'))['score__avg'] or 0

    # توزیع امتیازات (1 تا 5)
    rating_distribution = {}
    for i in range(1, 6):
        count = Rating.objects.filter(score=i).count()
        rating_distribution[i] = count

    # محصولات با بیشترین امتیاز
    top_rated_products = Product.objects.filter(
        weighted_rating__gt=0
    ).order_by('-weighted_rating')[:10]

    # محصولات با بیشترین تعداد امتیاز
    most_rated_products = Product.objects.annotate(
        rating_count=Count('ratings')
    ).order_by('-rating_count')[:10]

    # ========== آمار نظرات ==========
    total_comments = Comment.objects.count()
    active_comments = Comment.objects.filter(is_active=True).count()
    inactive_comments = total_comments - active_comments

    # کاربران با بیشترین نظر
    top_commenters = User.objects.annotate(
        comment_count=Count('comments')
    ).order_by('-comment_count')[:10]

    # محصولات با بیشترین نظر
    most_commented_products = Product.objects.annotate(
        comment_count=Count('comments')
    ).order_by('-comment_count')[:10]

    # ========== آمار بازدید و دانلود ==========
    total_views = Product.objects.aggregate(Sum('views_count'))['views_count__sum'] or 0
    total_downloads = Product.objects.aggregate(Sum('download_count'))['download_count__sum'] or 0

    # پربازدیدترین محصولات
    most_viewed_products = Product.objects.order_by('-views_count')[:10]

    # پربازدیدترین محصولات
    most_downloaded_products = Product.objects.order_by('-download_count')[:10]

    # ========== آمار محصولات بر اساس دسته ==========
    products_by_category = {}
    for cat in Category.objects.all():
        products_by_category[cat.name] = cat.products.count()

    # ========== آمار ماهانه (اخرین ۶ ماه) ==========
    monthly_ratings = []
    for i in range(6):
        date = timezone.now().date() - timedelta(days=30 * i)
        count = Rating.objects.filter(
            record_date__year=date.year,
            record_date__month=date.month
        ).count()
        monthly_ratings.append({
            'month': date.strftime('%Y-%m'),
            'count': count
        })

    context = {
        # آمار پایه
        'total_products': total_products,
        'total_movies': total_movies,
        'total_series': total_series,
        'total_categories': total_categories,

        # آمار کاربران
        'total_users': total_users,
        'staff_users': staff_users,
        'regular_users': regular_users,
        'old_users': old_users,
        'new_users': new_users,
        'active_users': active_users,

        # آمار امتیازات
        'total_ratings': total_ratings,
        'avg_rating': avg_rating,
        'rating_distribution': rating_distribution,
        'top_rated_products': top_rated_products,
        'most_rated_products': most_rated_products,

        # آمار نظرات
        'total_comments': total_comments,
        'active_comments': active_comments,
        'inactive_comments': inactive_comments,
        'top_commenters': top_commenters,
        'most_commented_products': most_commented_products,

        # آمار بازدید و دانلود
        'total_views': total_views,
        'total_downloads': total_downloads,
        'most_viewed_products': most_viewed_products,
        'most_downloaded_products': most_downloaded_products,

        # آمار دسته‌بندی
        'products_by_category': products_by_category,

        # آمار ماهانه
        'monthly_ratings': monthly_ratings,
    }

    return render(request, 'admin_dashboard.html', context)
