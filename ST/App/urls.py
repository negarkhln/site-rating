from django.urls import path
from django.contrib.auth import views as auth_views
from App.views import (
    home, user_login, user_logout, user_signup, rate_product, user_profile,
    add_comment, edit_comment, delete_comment
)

app_name = 'App'

urlpatterns = [
    path('', home, name='home'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('signup/', user_signup, name='signup'),
    path('product/<int:product_id>/rate/', rate_product, name='rate_product'),
    path('profile/', user_profile, name='profile'),
    path('product/<int:product_id>/comment/', add_comment, name='add_comment'),
    path('comment/<int:comment_id>/delete/', delete_comment, name='delete_comment'),
    path('comment/<int:comment_id>/edit/', edit_comment, name='edit_comment'),

    path('change-password/', auth_views.PasswordChangeView.as_view(
        template_name='change_password.html', success_url='/profile/'), name='change_password'),

]
