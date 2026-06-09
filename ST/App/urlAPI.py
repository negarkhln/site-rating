from django.urls import path
from App import views
from App.views.CustomTokenView import CustomTokenView
from App.views.ProfileDetailAPI import ProfileDetailAPI, UserRatingsAPI
from App.views.SignupAPIView import SignupAPIView
from App.views.UserDetailView import UserDetailView
from App.views.analytics_views import get_product_info_api, generate_rating_chart_api
from App.views.api_views import (
    ProductListAPI, ProductDetailAPI,
    CategoryListAPI, RateProductAPI, AddCommentAPI
)
from App.views.dashboard_views import admin_dashboard_api
from App.views.password_reset_views import ConfirmPasswordResetAPI, RequestPasswordResetAPI
from App.views.watchlist_views import WatchlistAPI

urlpatterns = [
    path('products/', ProductListAPI.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailAPI.as_view(), name='product-detail'),
    path('categories/', CategoryListAPI.as_view(), name='category-list'),
    path('products/<int:pk>/rate/', RateProductAPI.as_view(), name='rate-product'),
    path('products/<int:pk>/comment/', AddCommentAPI.as_view(), name='add-comment'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    # در App/urlAPI.py
    path('profile/', ProfileDetailAPI.as_view(), name='profile-api'),
    path('user-ratings/', UserRatingsAPI.as_view(), name='user-ratings-api'),
    path('signup/', SignupAPIView.as_view(), name='signup-api'),
    path('forgot-password/', RequestPasswordResetAPI.as_view(), name='api-forgot-password'),
    path('reset-password/<str:uidb64>/<str:token>/', ConfirmPasswordResetAPI.as_view(),
         name='api-reset-password-confirm'),
    path('watchlist/', WatchlistAPI.as_view(), name='api-watchlist'),
    path('watchlist/<int:product_id>/', WatchlistAPI.as_view(), name='api-watchlist-action'),
    path('comments/<int:comment_id>/edit/', views.edit_comment, name='api-edit-comment'),
    path('comments/<int:comment_id>/delete/', views.delete_comment, name='api-delete-comment'),
    path('admin/stats/', admin_dashboard_api, name='admin-stats'),
    path('admin/products/<int:product_id>/info/', get_product_info_api, name='api-product-info'),
    path('admin/products/<int:product_id>/chart/', generate_rating_chart_api, name='api-product-chart'),
    path('token/', CustomTokenView.as_view(), name='token_obtain_pair'),
]
