from rest_framework import generics  # این خط حیاتی است
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import Rating  # یا هر کجای دیگر که مدل Rating هست
from ..serializers import RatingSerializer


class ProfileDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = user.userprofile  # مدل پروفایل شما
        ratings = Rating.objects.filter(user=user)

        return Response({
            # اینجا نام فیلد رو از created_at به join_date تغییر دادیم
            'join_date': profile.join_date.strftime('%Y-%m-%d'),
            'login_count': profile.login_count,
            'total_ratings_count': profile.total_ratings_count,
            'sum_of_scores': profile.sum_of_scores,
            'is_old_user': profile.is_old_user
        })


class UserRatingsAPI(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RatingSerializer  # باید یک سریالایزر برای Rating داشته باشی

    def get_queryset(self):
        return Rating.objects.filter(user=self.request.user)
