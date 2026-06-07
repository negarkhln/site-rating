from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode


class RequestPasswordResetAPI(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('phone_or_username')
        if not username:
            return Response({'detail': 'وارد کردن نام کاربری الزامی است.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
            if not user.is_active:
                return Response({'detail': 'این حساب کاربری غیرفعال است.'}, status=status.HTTP_400_BAD_REQUEST)

            # تولید توکن و آیدی انحصاری کاربر
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            # ساخت لینکی که کاربر باید در ری‌اکت باز کند
            reset_link = f"http://localhost:5173/reset-confirm/{uid}/{token}"

            return Response({
                'detail': 'لینک بازیابی با موفقیت ساخته شد.',
                'reset_link': reset_link
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'detail': 'کاربری با این نام کاربری یافت نشد.'}, status=status.HTTP_404_NOT_FOUND)


class ConfirmPasswordResetAPI(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        password = request.data.get('new_password1')
        if not password:
            return Response({'detail': 'رمز عبور جدید الزامی است.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # دکود کردن آیدی کاربر
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)

            # بررسی صحت توکن
            if not default_token_generator.check_token(user, token):
                return Response({'detail': 'لینک بازیابی منقضی شده یا نامعتبر است.'},
                                status=status.HTTP_400_BAD_REQUEST)

            # ست کردن رمز جدید
            user.set_password(password)
            user.save()
            return Response({'detail': 'رمز عبور با موفقیت تغییر کرد.'}, status=status.HTTP_200_OK)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'detail': 'لینک نامعتبر است.'}, status=status.HTTP_400_BAD_REQUEST)
