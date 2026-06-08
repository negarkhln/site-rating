from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from django.db.models import Count, Avg, Sum
from App.models import Product, Rating, Comment, UserProfile, Category
from django.contrib.auth.models import User


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_api(request):
    # بدون try/except تا خطای واقعی در ترمینال جنگو چاپ شود
    total_products = Product.objects.count()

    total_movies = Product.objects.filter(category__name='فیلم').count() if Category.objects.filter(
        name='فیلم').exists() else 0
    total_series = Product.objects.filter(category__name='سریال').count() if Category.objects.filter(
        name='سریال').exists() else 0

    total_users = User.objects.count()
    staff_users = User.objects.filter(is_staff=True).count()
    regular_users = total_users - staff_users

    all_profiles = UserProfile.objects.all()
    old_users = 0
    new_users = 0
    active_users = 0

    for p in all_profiles:
        if hasattr(p, 'is_old_user'):
            if p.is_old_user:
                old_users += 1
            else:
                new_users += 1
        else:
            new_users += 1
        if hasattr(p, 'login_count') and p.login_count and p.login_count > 0:
            active_users += 1

    total_ratings = Rating.objects.count()
    avg_rating = Rating.objects.aggregate(Avg('score'))['score__avg'] or 0

    rating_distribution = {}
    for i in range(1, 6):
        rating_distribution[str(i)] = Rating.objects.filter(score=i).count()

    top_rated_products = []
    if total_products > 0:
        if hasattr(Product, 'weighted_rating'):
            top_rated_qs = Product.objects.exclude(weighted_rating__isnull=True).order_by('-weighted_rating')[:10]
        else:
            top_rated_qs = Product.objects.all()[:10]

        top_rated_products = [{
            'id': p.id,
            'Pname': getattr(p, 'Pname', 'بدون نام'),
            'weighted_rating': round(float(getattr(p, 'weighted_rating', 0) or 0), 2),
            'ratings_count': p.ratings.count() if hasattr(p, 'ratings') else 0,
            'views_count': getattr(p, 'views_count', 0) or 0
        } for p in top_rated_qs]

    most_viewed_products = []
    if total_products > 0 and hasattr(Product, 'views_count'):
        most_viewed_qs = Product.objects.order_by('-views_count')[:10]
        most_viewed_products = [{
            'id': p.id,
            'Pname': getattr(p, 'Pname', 'بدون نام'),
            'views_count': getattr(p, 'views_count', 0) or 0,
            'download_count': getattr(p, 'download_count', 0) or 0,
            'weighted_rating': round(float(getattr(p, 'weighted_rating', 0) or 0), 2)
        } for p in most_viewed_qs]

    top_commenters = []
    top_commenters_qs = User.objects.annotate(
        comment_count=Count('comments', distinct=True),
        ratings_count=Count('rating', distinct=True)
    ).order_by('-comment_count')[:10]

    for u in top_commenters_qs:
        profile = getattr(u, 'userprofile', None)
        is_old = getattr(profile, 'is_old_user', False) if profile else False
        top_commenters.append({
            'username': u.username,
            'comment_count': u.comment_count,
            'ratings_count': u.ratings_count,
            'is_old_user': is_old
        })

    total_views = Product.objects.aggregate(Sum('views_count'))['views_count__sum'] or 0 if hasattr(Product,
                                                                                                    'views_count') else 0
    total_downloads = Product.objects.aggregate(Sum('download_count'))['download_count__sum'] or 0 if hasattr(Product,
                                                                                                              'download_count') else 0

    products_by_category = {}
    for cat in Category.objects.all():
        products_by_category[cat.name] = cat.products.count() if hasattr(cat, 'products') else 0

    data = {
        'stats': {
            'totalProducts': total_products, 'totalMovies': total_movies, 'totalSeries': total_series,
            'totalUsers': total_users, 'staffUsers': staff_users, 'regularUsers': regular_users,
            'totalRatings': total_ratings, 'avgRating': round(avg_rating, 2),
            'totalComments': Comment.objects.count(),
            'activeComments': Comment.objects.filter(is_active=True).count(),
            'inactiveComments': Comment.objects.filter(is_active=False).count(),
            'totalViews': total_views, 'totalDownloads': total_downloads,
            'oldUsers': old_users, 'newUsers': new_users, 'activeUsers': active_users,
        },
        'ratingDistribution': rating_distribution, 'top_rated_products': top_rated_products,
        'mostViewedProducts': most_viewed_products, 'topCommenters': top_commenters,
        'productsByCategory': products_by_category
    }
    return JsonResponse(data, safe=False)
