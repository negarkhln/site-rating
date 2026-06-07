from django.db.models.signals import post_save, post_delete
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.db.models import Sum, F
from .models import Rating, UserProfile, Product


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


@receiver(user_logged_in)
def update_user_login_count(sender, request, user, **kwargs):
    UserProfile.objects.filter(user=user).update(
        login_count=F('login_count') + 1
    )


@receiver(post_save, sender=Rating)
def update_user_ratings_stats(sender, instance, created, **kwargs):
    profile = UserProfile.objects.get(user=instance.user)
    profile.total_ratings_count = Rating.objects.filter(user=instance.user).count()

    total_sum = Rating.objects.filter(user=instance.user).aggregate(total=Sum('score'))['total']
    profile.sum_of_scores = total_sum or 0

    profile.save(update_fields=['total_ratings_count', 'sum_of_scores'])


@receiver([post_save, post_delete], sender=Rating, dispatch_uid="update_product_rating_uid")
def update_product_rating(sender, instance, **kwargs):
    instance.product.calculate_weighted_rating()
