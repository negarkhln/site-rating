from rest_framework import serializers
from .models import Product, Comment, Rating, WatchList, Category, Season


class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'products_count']


class SeasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Season
        fields = ['season_number', 'episode_count', 'imdb_rating']


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # نمایش نام کاربری به جای ID

    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'created_at']


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    seasons = SeasonSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)  # اضافه شد: نمایش نظرات محصول

    class Meta:
        model = Product
        fields = '__all__'


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['product', 'score']
        # نکته: user به صورت خودکار در view ست می‌شود (در perform_create)


class WatchListSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.Pname')  # اضافه شد: نمایش نام محصول

    class Meta:
        model = WatchList
        fields = ['id', 'user', 'product', 'product_name', 'status', 'added_date']
