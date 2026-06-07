from django.db.models import Count, Q
from rest_framework import generics, permissions
from ..models import Product, Category, Rating, Comment
from ..serializers import (
    ProductSerializer, CategorySerializer,
    RatingSerializer, CommentSerializer
)


# لیست محصولات (با قابلیت فیلتر)
class ProductListAPI(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(status='published')
        cat = self.request.query_params.get('category')
        if cat: queryset = queryset.filter(category__slug=cat)
        return queryset


# جزئیات محصول
class ProductDetailAPI(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


# لیست دسته‌بندی‌ها (با تعداد محصولات)
class CategoryListAPI(generics.ListAPIView):
    queryset = Category.objects.annotate(
        products_count=Count('products', filter=Q(products__status='published'))
    )
    serializer_class = CategorySerializer


# ثبت امتیاز (نیاز به لاگین)
class RateProductAPI(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RatingSerializer

    def perform_create(self, serializer):
        product = Product.objects.get(pk=self.kwargs['pk'])
        rating, _ = Rating.objects.update_or_create(
            product=product, user=self.request.user,
            defaults={'score': serializer.validated_data['score']}
        )
        product.calculate_weighted_rating()


# ثبت نظر (نیاز به لاگین)
class AddCommentAPI(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        product = Product.objects.get(pk=self.kwargs['pk'])
        serializer.save(user=self.request.user, product=product)
