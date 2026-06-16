from .user_login import user_login, user_logout, user_signup
from .home_view import home
from .product_views import ProductListView
from .api_views import ProductDetailAPI
from .rating_views import rate_product
from .profile_views import user_profile
from .comment_views import add_comment, delete_comment, edit_comment

# این خط زیر را برای پشتیبانی از کدهای قدیمی که شاید هنوز دنبال ProductDetailView می‌گردند اضافه می‌کنیم
ProductDetailView = ProductDetailAPI
