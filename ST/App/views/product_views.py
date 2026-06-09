from rest_framework import generics
from django.db.models import Q
from ..models import Product
from ..serializers import ProductSerializer


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        # شروع با تمام محصولات منتشر شده
        queryset = Product.objects.filter(status='published')

        # ۱. دریافت پارامترها از URL (Query Params)
        search_query = self.request.query_params.get('search', '')
        min_rating = self.request.query_params.get('min_rating', '')
        sort_by = self.request.query_params.get('sort_by', 'rating_desc')
        category_slug = self.request.query_params.get('category', '')

        # ۲. فیلتر بر اساس دسته‌بندی
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        # ۳. جستجو بر اساس نام
        if search_query:
            queryset = queryset.filter(Pname__icontains=search_query)

        # ۴. فیلتر حداقل امتیاز
        if min_rating:
            try:
                queryset = queryset.filter(weighted_rating__gte=float(min_rating))
            except ValueError:
                pass

        # ۵. مرتب‌سازی (Sorting)
        if sort_by == 'name_asc':
            queryset = queryset.order_by('Pname')
        elif sort_by == 'name_desc':
            queryset = queryset.order_by('-Pname')
        elif sort_by == 'rating_asc':
            queryset = queryset.order_by('weighted_rating')
        elif sort_by == 'newest':
            queryset = queryset.order_by('-id')
        else:  # پیش‌فرض: امتیاز نزولی
            queryset = queryset.order_by('-weighted_rating')

        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'id'  # از ID برای پیدا کردن محصول استفاده می‌کنیم
