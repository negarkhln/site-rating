from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.urls import reverse


def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect(reverse('App:home'))
        else:
            messages.error(request, 'نام کاربری یا رمز عبور اشتباه است')

    return render(request, 'login.html')


def user_logout(request):
    logout(request)
    return redirect(reverse('App:login'))


def user_signup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

        # بررسی کنید که رمزها مطابقت دارند
        if password1 != password2:
            messages.error(request, 'رمز عبور و تکرار آن مطابقت ندارند')
            return render(request, 'signup.html')

        # بررسی کنید که نام کاربری تکراری نباشد
        if User.objects.filter(username=username).exists():
            messages.error(request, 'این نام کاربری قبلاً ثبت شده است')
            return render(request, 'signup.html')

        # بررسی کنید که ایمیل تکراری نباشد
        if email and User.objects.filter(email=email).exists():
            messages.error(request, 'این ایمیل قبلاً ثبت شده است')
            return render(request, 'signup.html')

        # ساخت کاربر جدید
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password1
        )

        # توجه: پروفایل کاربر توسط سیگنال post_save به صورت خودکار ساخته می‌شود

        messages.success(request, 'حساب کاربری شما با موفقیت ساخته شد. حالا می‌توانید وارد شوید.')
        return redirect(reverse('App:login'))

    return render(request, 'signup.html')
