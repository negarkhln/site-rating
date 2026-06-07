from django.urls import path

from App.views.ProfileDetailAPI import ProfileDetailAPI, UserRatingsAPI
from App.views.SignupAPIView import SignupAPIView
from App.views.UserDetailView import UserDetailView
from App.views.api_views import (
    ProductListAPI, ProductDetailAPI,
    CategoryListAPI, RateProductAPI, AddCommentAPI
)
from App.views.password_reset_views import ConfirmPasswordResetAPI, RequestPasswordResetAPI

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
]
