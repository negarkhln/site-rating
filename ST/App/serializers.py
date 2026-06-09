from rest_framework import serializers
# ۱. ایمپورت کردن سریالایزر پیش‌فرض SimpleJWT
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Product, Comment, Rating, WatchList, Category, Season


# ۲. اضافه کردن سریالایزر سفارشی برای توکن لاگین
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # اضافه کردن فیلد is_staff به بدنه پاسخ لاگین
        data['is_staff'] = self.user.is_staff
        return data


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
    comments = CommentSerializer(many=True, read_only=True)

    # 🟢 گرد کردن امتیاز وزندار تا ۲ رقم اعشار
    weighted_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_weighted_rating(self, obj):
        if hasattr(obj, 'weighted_rating') and obj.weighted_rating is not None:
            return round(float(obj.weighted_rating), 2)
        return 0.0


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['product', 'score']


class WatchListSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.Pname')

    class Meta:
        model = WatchList
        fields = ['id', 'user', 'product', 'product_name', 'status', 'added_date']
