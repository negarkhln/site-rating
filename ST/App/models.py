from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
from django.utils import timezone
from django.utils.html import format_html
from django.utils.text import slugify  # ✅ حتماً این خط باید در بالای فایل models.py باشد


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="نام دسته")
    slug = models.SlugField(max_length=100, unique=True, blank=True, verbose_name="اسلاگ")
    description = models.TextField(blank=True, null=True, verbose_name="توضیحات")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")

    class Meta:
        verbose_name = "دسته‌بندی"
        verbose_name_plural = "دسته‌بندی‌ها"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            # استفاده از slugify با پشتیبانی از فارسی
            self.slug = slugify(self.name, allow_unicode=True)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='userprofile')
    join_date = models.DateField(auto_now_add=True)
    login_count = models.IntegerField(default=0)
    total_ratings_count = models.IntegerField(default=0)
    sum_of_scores = models.IntegerField(default=0)

    @property
    def is_old_user(self):
        MIN_DAYS = 10
        MIN_LOGINS = 5
        MIN_AVG_SCORE = 3.5

        flag = 0

        days_since_join = (timezone.now().date() - self.join_date).days
        if days_since_join >= MIN_DAYS:
            flag += 1

        if self.login_count >= MIN_LOGINS:
            flag += 1

        if self.total_ratings_count > 0:
            average_score = self.sum_of_scores / self.total_ratings_count
            if average_score >= MIN_AVG_SCORE:
                flag += 1

        return flag >= 2

    def is_old_user_display(self):
        if self.is_old_user:
            return format_html('<span style="color: green; font-weight: bold;">✓ کاربر قدیمی</span>')
        else:
            return format_html('<span style="color: red; font-weight: bold;">✗ کاربر جدید</span>')

    is_old_user_display.short_description = 'وضعیت کاربر'

    def __str__(self):
        return f"{self.user.username} - {'قدیمی' if self.is_old_user else 'جدید'}"


class Product(models.Model):
    # فیلدهای قبلی
    PCode = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    Pname = models.CharField(max_length=200, verbose_name="نام محصول")
    expiration = models.DateField(null=True, blank=True, verbose_name="تاریخ انقضا")
    weighted_rating = models.FloatField(default=0.0, verbose_name="امتیاز وزندار")
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products',
        verbose_name="دسته‌بندی"
    )

    # فیلدهای جدید برای فیلم و سریال
    # اطلاعات پایه
    director = models.CharField(max_length=200, blank=True, null=True, verbose_name="کارگردان")
    writer = models.CharField(max_length=200, blank=True, null=True, verbose_name="نویسنده")
    cast = models.TextField(blank=True, null=True, verbose_name="بازیگران (با کاما جدا کنید)")
    genre = models.CharField(max_length=200, blank=True, null=True, verbose_name="ژانر")

    # اطلاعات فنی
    release_date = models.DateField(null=True, blank=True, verbose_name="تاریخ انتشار")
    duration = models.IntegerField(null=True, blank=True, verbose_name="مدت زمان (دقیقه)")
    language = models.CharField(max_length=100, default="فارسی", verbose_name="زبان")
    country = models.CharField(max_length=100, blank=True, null=True, verbose_name="کشور سازنده")

    # توضیحات
    description = models.TextField(blank=True, null=True, verbose_name="توضیحات")
    storyline = models.TextField(blank=True, null=True, verbose_name="خلاصه داستان")

    # فایل‌ها و لینک‌ها
    poster = models.ImageField(upload_to='posters/', blank=True, null=True, verbose_name="پوستر")
    trailer_url = models.URLField(blank=True, null=True, verbose_name="لینک تریلر")
    download_url = models.URLField(blank=True, null=True, verbose_name="لینک دانلود")
    download_file = models.FileField(upload_to='downloads/', blank=True, null=True, verbose_name="فایل دانلود")

    # اطلاعات آماری
    views_count = models.IntegerField(default=0, verbose_name="تعداد بازدید")
    download_count = models.IntegerField(default=0, verbose_name="تعداد دانلود")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="آخرین بروزرسانی")

    # وضعیت
    STATUS_CHOICES = [
        ('draft', 'پیش‌نویس'),
        ('published', 'منتشر شده'),
        ('archived', 'بایگانی شده'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name="وضعیت")

    # فیلدهای جدید برای نمره‌گذاری
    imdb_rating = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        null=True,
        blank=True,
        verbose_name="امتیاز IMDb",
        help_text="مثلاً 8.8"
    )
    metacritic_score = models.IntegerField(
        null=True,
        blank=True,
        verbose_name="نمره متاکریتیک",
        help_text="مثلاً 85"
    )

    class Meta:
        verbose_name = "محصول"
        verbose_name_plural = "محصولات"
        ordering = ['-created_at']

    def calculate_weighted_rating(self):
        # کد قبلی بدون تغییر
        ratings = self.ratings.all()
        rating_count = ratings.count()

        if rating_count == 0:
            self.weighted_rating = 0
            self.save(update_fields=['weighted_rating'])
            return 0

        total_weighted = 0
        total_weight = 0

        for rating in ratings:
            profile = getattr(rating.user, 'userprofile', None)
            is_old = profile.is_old_user if profile else False
            weight = 2.0 if is_old else 1.0
            total_weighted += rating.score * weight
            total_weight += weight

        R = total_weighted / total_weight if total_weight > 0 else 0
        v = rating_count
        m = 3

        from django.db.models import Avg
        all_products_avg = Product.objects.exclude(pk=self.pk).aggregate(
            avg=Avg('weighted_rating')
        )['avg'] or 0
        C = all_products_avg

        weighted = (v / (v + m)) * R + (m / (v + m)) * C

        self.weighted_rating = weighted
        self.save(update_fields=['weighted_rating'])
        return weighted

    def __str__(self):
        return self.Pname


class Comment(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField(verbose_name="متن نظر")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ نظر")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="آخرین ویرایش")
    is_active = models.BooleanField(default=True, verbose_name="فعال/غیرفعال")

    class Meta:
        verbose_name = "نظر"
        verbose_name_plural = "نظرات"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.product.Pname} - {self.created_at.strftime('%Y-%m-%d')}"


class Rating(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="ratings")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    record_date = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('product', 'user')

    def __str__(self):
        return f"{self.user.username} → {self.product.Pname}: {self.score}"


class WatchList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='watchlist')
    added_date = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ اضافه شدن")
    STATUS_CHOICES = [
        ('watching', 'در حال تماشا'),
        ('completed', 'تماشا شده'),
        ('planning', 'بعداً می‌بینم'),
        ('favorite', 'علاقه‌مندی'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning', verbose_name="وضعیت")

    class Meta:
        unique_together = ('user', 'product')  # هر کاربر فقط یک بار می‌تونه هر محصول رو اضافه کنه
        verbose_name = "لیست تماشا"
        verbose_name_plural = "لیست‌های تماشا"

    def __str__(self):
        return f"{self.user.username} - {self.product.Pname} - {self.get_status_display()}"


# مدل جدید برای مدیریت فصل‌های سریال
class Season(models.Model):
    series = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='seasons',
        limit_choices_to={'category__name': 'سریال'}  # فقط برای سریال‌ها
    )
    season_number = models.PositiveSmallIntegerField(verbose_name="شماره فصل")
    episode_count = models.PositiveSmallIntegerField(verbose_name="تعداد قسمت‌ها")
    imdb_rating = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        null=True,
        blank=True,
        verbose_name="امتیاز IMDb فصل"
    )

    class Meta:
        unique_together = ('series', 'season_number')  # جلوگیری از ثبت فصل تکراری
        ordering = ['series__Pname', 'season_number']
        verbose_name = "فصل سریال"
        verbose_name_plural = "فصل‌های سریال"

    def __str__(self):
        return f"{self.series.Pname} - فصل {self.season_number}"
