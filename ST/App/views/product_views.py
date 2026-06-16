from rest_framework import generics
from rest_framework.response import Response
from ..models import Product
from ..serializers import ProductSerializer

# ایمپورت کردن الگوریتم‌های دستی از فولدری که ساختیم (خواسته استاد)
from App.SoftwareTestingAlgorithms.search.linear_search import manual_linear_search
from App.SoftwareTestingAlgorithms.sort.bubble_sort import manual_bubble_sort_by_name
from App.SoftwareTestingAlgorithms.sort.selection_sort import manual_selection_sort_by_rating


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        # دریافت کل فیلم‌های منتشر شده به عنوان دیتاست خام دیتابیس
        queryset = Product.objects.filter(status='published')

        # فیلترهای اولیه و ساختاری (مثل دسته‌بندی و حداقل امتیاز)
        category_slug = self.request.query_params.get('category', '')
        min_rating = self.request.query_params.get('min_rating', '')

        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        if min_rating:
            try:
                queryset = queryset.filter(weighted_rating__gte=float(min_rating))
            except ValueError:
                pass

        return queryset

    # اورراید کردن متد list برای اجرای الگوریتم‌های درس آزمون نرم‌افزار روی لیست پایتونی
    def list(self, request, *args, **kwargs):
        # ۱. تبدیل کوئری‌ست جنگو به یک لیست ساده پایتونی
        raw_products = list(self.get_queryset())

        # ۲. دریافت ترجیحات مرتب‌سازی و جستجوی کاربر از پارامترهای URL
        search_query = self.request.query_params.get('search', '')
        sort_by = self.request.query_params.get('sort_by', 'rating_desc')

        # ۳. اعمال الگوریتم جستجوی دستی خطی
        filtered_products = manual_linear_search(raw_products, search_query)

        # ۴. اعمال الگوریتم‌های مرتب‌سازی دستی بر اساس ترجیح کاربر
        if sort_by == 'name_asc':
            final_products = manual_bubble_sort_by_name(filtered_products, reverse=False)
        elif sort_by == 'name_desc':
            final_products = manual_bubble_sort_by_name(filtered_products, reverse=True)
        elif sort_by == 'rating_asc':
            final_products = manual_selection_sort_by_rating(filtered_products, reverse=False)
        elif sort_by == 'rating_desc':
            final_products = manual_selection_sort_by_rating(filtered_products, reverse=True)
        else:
            # حالت پیش‌فرض: مرتب‌سازی با امتیار وزن‌دار به صورت نزولی
            final_products = manual_selection_sort_by_rating(filtered_products, reverse=True)

        # ۵. تبدیل آبجکت‌ها به فرمت JSON و فرستادن خروجی نهایی برای React
        serializer = self.get_serializer(final_products, many=True)
        return Response(serializer.data)
