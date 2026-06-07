from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny


class SignupAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        # اینجا اصلاح شد: استفاده از not به جای !
        if not username or not password:
            return Response({'detail': 'نام کاربری و رمز عبور الزامی است.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'detail': 'این نام کاربری قبلاً انتخاب شده است.'}, status=status.HTTP_400_BAD_REQUEST)

        # ساخت کاربر جدید
        user = User.objects.create_user(username=username, email=email, password=password)

        return Response({'detail': 'ثبت‌نام با موفقیت انجام شد.'}, status=status.HTTP_201_CREATED)
