from django import template

register = template.Library()


@register.filter
def star_rating(rating):
    """
    Convert numeric rating (0-5) to star symbols
    Example: 4.2 -> ★★★★☆
    """
    if rating is None:
        rating = 0

    # محاسبه تعداد ستاره‌های کامل، نیمه و خالی
    full_stars = int(rating)
    # بررسی نیم ستاره (اگه اعشار >= 0.5 باشه)
    half_star = (rating - full_stars) >= 0.5
    empty_stars = 5 - full_stars - (1 if half_star else 0)

    # ساخت خروجی
    stars = '★' * full_stars
    if half_star:
        stars += '½'
    stars += '☆' * empty_stars

    return stars
