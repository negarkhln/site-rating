from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class UserDetailView(APIView):
    # این خط باعث می‌شود فقط کاربرانی که توکن معتبر دارند دسترسی داشته باشند
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email
        })
