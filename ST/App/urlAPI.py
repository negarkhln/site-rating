from django.urls import path
from App.views.api_views import (
    ProductListAPI, ProductDetailAPI,
    CategoryListAPI, RateProductAPI, AddCommentAPI
)

urlpatterns = [
    path('products/', ProductListAPI.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailAPI.as_view(), name='product-detail'),
    path('categories/', CategoryListAPI.as_view(), name='category-list'),
    path('products/<int:pk>/rate/', RateProductAPI.as_view(), name='rate-product'),
    path('products/<int:pk>/comment/', AddCommentAPI.as_view(), name='add-comment'),
]
