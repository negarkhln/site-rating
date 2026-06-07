# App/tests/test_acoc.py

from django.test import TestCase
from django.contrib.auth.models import User
from App.models import Product, Rating, UserProfile
from datetime import date, timedelta
from django.utils import timezone


class ACOCTestCase(TestCase):
    """All Combinations of Conditions (ACOC) Test Cases"""

    def setUp(self):
        # ایجاد کاربر تستی
        self.user = User.objects.create_user('testuser', 'test@test.com', 'test123')
        self.product = Product.objects.create(
            Pname='Test Movie',
            weighted_rating=0.0,
            status='published'
        )

    def test_acoc_all_true(self):
        """Test: همه شرایط برای کاربر قدیمی درست باشد"""
        profile = self.user.userprofile
        profile.join_date = timezone.now().date() - timedelta(days=15)  # > 10 روز
        profile.login_count = 10  # > 5
        profile.total_ratings_count = 5
        profile.sum_of_scores = 20  # میانگین = 4 > 3.5
        profile.save()

        self.assertTrue(profile.is_old_user)

    def test_acoc_only_days_true(self):
        """Test: فقط شرط روزها درست باشد"""
        profile = self.user.userprofile
        profile.join_date = timezone.now().date() - timedelta(days=15)
        profile.login_count = 3  # < 5
        profile.total_ratings_count = 0
        profile.save()

        self.assertFalse(profile.is_old_user)

    def test_acoc_only_logins_true(self):
        """Test: فقط شرط لاگین‌ها درست باشد"""
        profile = self.user.userprofile
        profile.join_date = timezone.now().date() - timedelta(days=5)
        profile.login_count = 10
        profile.total_ratings_count = 0
        profile.save()

        self.assertFalse(profile.is_old_user)

    def test_acoc_only_rating_true(self):
        """Test: فقط شرط میانگین امتیاز درست باشد"""
        profile = self.user.userprofile
        profile.join_date = timezone.now().date() - timedelta(days=5)
        profile.login_count = 3
        profile.total_ratings_count = 2
        profile.sum_of_scores = 8  # میانگین = 4
        profile.save()

        self.assertFalse(profile.is_old_user)

    def test_acoc_boundary_days_10(self):
        """Test: مرز شرط روزها (دقیقاً 10 روز)"""
        profile = self.user.userprofile
        profile.join_date = timezone.now().date() - timedelta(days=10)
        profile.login_count = 5
        profile.total_ratings_count = 2
        profile.sum_of_scores = 8
        profile.save()

        self.assertTrue(profile.is_old_user)  # >= 10 درسته

    def test_acoc_boundary_logins_5(self):
        """Test: مرز شرط لاگین (دقیقاً 5 بار)"""
        profile = self.user.userprofile
        profile.join_date = timezone.now().date() - timedelta(days=15)
        profile.login_count = 5
        profile.total_ratings_count = 2
        profile.sum_of_scores = 8
        profile.save()

        self.assertTrue(profile.is_old_user)

    def test_acoc_boundary_rating_3_5(self):
        """Test: مرز شرط میانگین امتیاز (دقیقاً 3.5)"""
        profile = self.user.userprofile
        profile.join_date = timezone.now().date() - timedelta(days=15)
        profile.login_count = 5
        profile.total_ratings_count = 2
        profile.sum_of_scores = 7  # میانگین = 3.5
        profile.save()

        self.assertTrue(profile.is_old_user)
