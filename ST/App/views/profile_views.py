from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from App.models import UserProfile, Rating


@login_required
def user_profile(request):
    profile = request.user.userprofile
    ratings = Rating.objects.filter(user=request.user)

    # محاسبه میانگین امتیازات
    average_score = 0
    if profile.total_ratings_count > 0:
        average_score = profile.sum_of_scores / profile.total_ratings_count

    return render(request, 'profile.html', {
        'profile': profile,
        'ratings': ratings,
        'average_score': average_score,
    })
