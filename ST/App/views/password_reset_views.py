from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib import messages
from django.views.generic.edit import FormView
from django.urls import reverse_lazy
from django.contrib.auth.views import PasswordResetConfirmView
from App.forms import PhoneResetForm

User = get_user_model()


class CustomPasswordResetView(FormView):
    """
    ویوی بازیابی رمز عبور بدون ایمیل - فقط با نام کاربری
    """
    template_name = 'phone_forgot_password.html'
    form_class = PhoneResetForm
    success_url = reverse_lazy('App:password_reset_done_no_email')

    def form_valid(self, form):
        username = form.cleaned_data['phone_or_username']  # اینجا اسم کاربری گرفته میشه

        try:
            # جستجوی کاربر بر اساس نام کاربری
            user = User.objects.get(username=username)

            if user and user.is_active:
                # تولید uid و token
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                token = default_token_generator.make_token(user)

                # ساخت لینک کامل
                reset_link = self.request.build_absolute_uri(
                    reverse_lazy('App:password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
                )

                # ذخیره لینک در session برای نمایش در صفحه بعد
                self.request.session['reset_link'] = reset_link
                self.request.session['reset_user'] = user.username

                messages.success(self.request, 'لینک بازیابی با موفقیت ساخته شد.')
            else:
                messages.warning(self.request, 'کاربر غیرفعال است.')

        except User.DoesNotExist:
            messages.warning(self.request, 'کاربری با این نام کاربری یافت نشد.')
        except Exception as e:
            messages.error(self.request, f'خطایی رخ داده است: {str(e)}')

        return super().form_valid(form)


class PasswordResetDoneNoEmailView(FormView):
    """صفحه نمایش لینک بازیابی به کاربر"""
    template_name = 'phone_reset_done.html'

    def get(self, request, *args, **kwargs):
        reset_link = request.session.get('reset_link', '')
        reset_user = request.session.get('reset_user', '')

        return render(request, self.template_name, {
            'reset_link': reset_link,
            'reset_user': reset_user
        })


class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    template_name = 'phone_reset_confirm.html'
    success_url = reverse_lazy('App:password_reset_complete')


class CustomPasswordResetCompleteView(FormView):
    template_name = 'phone_reset_complete.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)