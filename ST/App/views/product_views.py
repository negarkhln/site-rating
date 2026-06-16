from rest_framework import generics
from rest_framework.response import Response
from django.db.models import Q
from ..models import Product
from ..serializers import ProductSerializer


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(status='published')

        # ۱. دریافت پارامترها از URL
        search_query = self.request.query_params.get('search', '')
        min_rating = self.request.query_params.get('min_rating', '')
        sort_by = self.request.query_params.get('sort_by', 'rating_desc')
        category_slug = self.request.query_params.get('category', '')

        # ۲. فیلتر بر اساس دسته‌بندی (اسلاگ)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        # ۳. جستجو بر اساس نام محصول یا کارگردان
        if search_query:
            queryset = queryset.filter(
                Q(Pname__icontains=search_query) |
                Q(director__icontains=search_query)
            )

        # ۴. فیلتر حداقل امتیاز وزن‌دار
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
        elif sort_by == 'rating_desc':
            queryset = queryset.order_by('-weighted_rating')
        elif sort_by == 'newest':
            queryset = queryset.order_by('-id')
        elif sort_by == 'views_desc':
            queryset = queryset.order_by('-views_count')
        else:
            queryset = queryset.order_by('-weighted_rating')

        return queryset

    # برای اینکه فرانت‌اند مستقیم دیتای لیست (آرایه) یا آبجکت پیجینیشن را درست بگیرد
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # هندل کردن دستی پیجینیشن ساده بدون به هم ریختن استیت‌های فرانت
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
