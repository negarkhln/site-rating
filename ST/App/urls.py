from django.urls import path
from django.contrib.auth import views as auth_views
from App.views import (
    home, user_login, user_logout, user_signup,
    product_list, product_detail, rate_product, user_profile,
    add_comment, edit_comment, delete_comment
)
from App.views.analytics_views import product_rating_analytics, generate_rating_chart
from App.views.dashboard_views import admin_dashboard
from App.views.graph_views import simple_graph_page, generate_graph  # <-- generate_graph رو اضافه کن
from App.views.product_views import download_product
from App.views.password_reset_views import (
    CustomPasswordResetView,
    PasswordResetDoneNoEmailView,
    CustomPasswordResetConfirmView,
    CustomPasswordResetCompleteView
)
from App.views.watchlist_views import add_to_watchlist, remove_from_watchlist, update_watchlist_status, watchlist_page

app_name = 'App'

urlpatterns = [
    path('', home, name='home'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('signup/', user_signup, name='signup'),
    path('products/', product_list, name='product_list'),
    path('product/<int:product_id>/', product_detail, name='product_detail'),
    path('product/<int:product_id>/rate/', rate_product, name='rate_product'),
    path('product/<int:product_id>/download/', download_product, name='download_product'),
    path('profile/', user_profile, name='profile'),
    path('product/<int:product_id>/comment/', add_comment, name='add_comment'),
    path('comment/<int:comment_id>/delete/', delete_comment, name='delete_comment'),
    path('comment/<int:comment_id>/edit/', edit_comment, name='edit_comment'),

    path('change-password/', auth_views.PasswordChangeView.as_view(
        template_name='change_password.html', success_url='/profile/'), name='change_password'),

    path('forgot-password/', CustomPasswordResetView.as_view(), name='forgot_password'),
    path('reset/done/', PasswordResetDoneNoEmailView.as_view(), name='password_reset_done_no_email'),
    path('reset/<uidb64>/<token>/', CustomPasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/complete/', CustomPasswordResetCompleteView.as_view(), name='password_reset_complete'),

    path('admin-dashboard/', admin_dashboard, name='admin_dashboard'),

    # گراف‌ها
    path('generate-graph/<str:graph_type>/', generate_graph, name='generate_graph'),  # <-- این خط رو اضافه کن
    path('graph/<str:graph_type>/', simple_graph_page, name='simple_graph'),

    # نمودار تحلیلی
    path('analytics/product/<int:product_id>/', product_rating_analytics, name='product_analytics'),
    path('analytics/chart/<int:product_id>/', generate_rating_chart, name='analytics_chart'),

    # Watchlist
    path('watchlist/', watchlist_page, name='watchlist'),
    path('watchlist/add/<int:product_id>/', add_to_watchlist, name='add_to_watchlist'),
    path('watchlist/remove/<int:product_id>/', remove_from_watchlist, name='remove_from_watchlist'),
    path('watchlist/update/<int:product_id>/', update_watchlist_status, name='update_watchlist_status'),
]
