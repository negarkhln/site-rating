from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status


@api_view(['POST'])
@permission_classes([AllowAny])  # اجازه دسترسی به همه کاربران بدون نیاز به توکن احراز هویت
def contact_us_view(request):
    """
    API جهت دریافت پیام‌های فرم ارتباط با ما
    """
    # دریافت اطلاعات ارسالی از سمت فرانت‌انند (React)
    name = request.data.get('name')
    email = request.data.get('email')
    message = request.data.get('message')

    # چاپ اطلاعات در ترمینال سرور جهت اطمینان از دریافت دیتا
    print(f"📩 پیام جدید دریافت شد | فرستنده: {name} ({email}) | متن: {message}")

    # بازگرداندن پاسخ موفقیت‌آمیز HTTP 200 به فرانت‌انند
    return Response(
        {
            "status": "success",
            "message": "پیام شما با موفقیت دریافت شد."
        },
        status=status.HTTP_200_OK
    )
