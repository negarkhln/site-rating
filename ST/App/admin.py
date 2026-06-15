from django.contrib import admin
from django.utils.html import format_html
from .models import Product, Rating, UserProfile, Category, Comment, WatchList, Season


# ========== WatchList Admin ==========
@admin.register(WatchList)
class WatchListAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'status', 'added_date')
    list_filter = ('status', 'added_date')
    search_fields = ('user__username', 'product__Pname')
    list_editable = ('status',)


# ========== Category Admin ==========
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)
    fields = ('name', 'slug', 'description')


# ========== Season Inline (برای داخل ProductAdmin) ==========
class SeasonInline(admin.TabularInline):
    model = Season
    extra = 1
    fields = ('season_number', 'episode_count', 'imdb_rating')


# ========== Rating Inline (نمایش جزئیات امتیازهای وزن‌دار داخل صفحه محصول) ==========
class RatingInline(admin.TabularInline):
    model = Rating
    fields = ('user', 'score', 'get_user_status', 'get_weight', 'record_date')
    readonly_fields = ('user', 'score', 'get_user_status', 'get_weight', 'record_date')
    extra = 0
    can_delete = True  #  فعال کردن دکمه حذف برای هر ردیف امتیاز
    verbose_name = "امتیاز"
    verbose_name_plural = " گزارش جزئیات امتیازهای وزن‌دار این محصول"

    def get_user_status(self, obj):
        if obj and obj.user:
            try:
                profile = obj.user.userprofile
                if profile.is_old_user:
                    return format_html('<span style="color: #2ecc71; font-weight: bold;">{}</span>', '✓ کاربر قدیمی')
                return format_html('<span style="color: #e67e22; font-weight: bold;">{}</span>', '✗ کاربر جدید')
            except Exception:
                profile_exists = UserProfile.objects.filter(user=obj.user).first()
                if profile_exists:
                    if profile_exists.is_old_user:
                        return format_html('<span style="color: #2ecc71; font-weight: bold;">{}</span>',
                                           '✓ کاربر قدیمی')
                    return format_html('<span style="color: #e67e22; font-weight: bold;">{}</span>', '✗ کاربر جدید')
        return format_html('<span style="color: #7f8c8d;">{}</span>', 'نامشخص')

    get_user_status.short_description = 'وضعیت کاربر'

    def get_weight(self, obj):
        if obj and obj.user:
            try:
                profile = obj.user.userprofile
                if profile.is_old_user:
                    return format_html('<span style="color: #2ecc71; font-weight: bold;">{}</span>', 'ضریب ۲.۰')
                return format_html('<span style="color: #e67e22; font-weight: bold;">{}</span>', 'ضریب ۱.۰')
            except Exception:
                profile_exists = UserProfile.objects.filter(user=obj.user).first()
                if profile_exists:
                    if profile_exists.is_old_user:
                        return format_html('<span style="color: #2ecc71; font-weight: bold;">{}</span>', 'ضریب ۲.۰')
                    return format_html('<span style="color: #e67e22; font-weight: bold;">{}</span>', 'ضریب ۱.۰')
        return format_html('<span style="color: #7f8c8d;">{}</span>', 'نامشخص')

    get_weight.short_description = 'وزن اعمال‌شده در فرمول'

    # برای اینکه علی‌رغم Readonly بودن فیلدها، اجازه حذف ردیف داده شود
    def has_delete_permission(self, request, obj=None):
        return True


# ========== Product Admin ==========
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'Pname', 'category', 'director', 'imdb_rating', 'weighted_rating', 'views_count', 'download_count', 'status')
    list_filter = ('status', 'category', 'language', 'genre', 'release_date')
    search_fields = ('Pname', 'director', 'cast', 'description')
    list_editable = ('status',)
    readonly_fields = ('PCode', 'weighted_rating', 'views_count', 'download_count', 'created_at', 'updated_at')

    inlines = [SeasonInline, RatingInline]

    fieldsets = (
        ('اطلاعات اصلی', {
            'fields': ('Pname', 'category', 'status', 'description')
        }),
        ('اطلاعات فیلم/سریال', {
            'fields': (
                'director', 'writer', 'cast', 'genre', 'release_date', 'duration', 'language', 'country', 'storyline')
        }),
        ('نمرات و امتیازات', {
            'fields': ('imdb_rating', 'metacritic_score'),
        }),
        ('فایل‌ها و لینک‌ها', {
            'fields': ('poster', 'trailer_url', 'download_url', 'download_file')
        }),
        ('آمار', {
            'fields': ('views_count', 'download_count', 'weighted_rating'),
            'classes': ('collapse',)
        }),
        ('سیستم', {
            'fields': ('PCode', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if obj and obj.category and obj.category.name == 'سریال':
            form.base_fields['imdb_rating'].help_text = "امتیاز کلی سریال در IMDb"
        else:
            form.base_fields['imdb_rating'].help_text = "امتیاز فیلم در IMDb"
        return form


# ========== Comment Admin ==========
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'text_preview', 'created_at', 'is_active')
    list_filter = ('is_active', 'created_at')
    search_fields = ('user__username', 'product__Pname', 'text')
    list_editable = ('is_active',)
    readonly_fields = ('created_at', 'updated_at')

    def text_preview(self, obj):
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text

    text_preview.short_description = "متن نظر"


# ========== Rating Admin ==========
@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'score', 'record_date')
    list_filter = ('score', 'record_date')
    search_fields = ('product__Pname', 'user__username')
    readonly_fields = ('record_date',)
