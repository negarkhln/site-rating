# App/views/analytics_views.py

from django.shortcuts import render, get_object_or_404
from django.contrib.admin.views.decorators import staff_member_required
from django.http import JsonResponse
from django.db.models import Avg, Count
from django.utils import timezone
from datetime import timedelta
from App.models import Product, Rating
import matplotlib

matplotlib.use('Agg')
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import numpy as np


@staff_member_required
def product_rating_analytics(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    return render(request, 'product_analytics.html', {'product': product})


@staff_member_required
def generate_rating_chart(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    period = request.GET.get('period', 'monthly')
    days = int(request.GET.get('days', 90))

    start_date = timezone.now().date() - timedelta(days=days)

    ratings = Rating.objects.filter(
        product=product,
        record_date__gte=start_date
    ).order_by('record_date')

    if not ratings.exists():
        plt.figure(figsize=(10, 5))
        plt.text(0.5, 0.5, 'No rating data available', ha='center', va='center', fontsize=12)
        plt.title(f'{product.Pname} - Rating Timeline', fontsize=12)
        buffer = BytesIO()
        plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
        plt.close()
        return JsonResponse({'chart': image_base64})

    # گروه‌بندی داده‌ها
    if period == 'weekly':
        dates = []
        scores = []
        counts = []
        current_date = start_date
        while current_date <= timezone.now().date():
            week_end = current_date + timedelta(days=6)
            week_ratings = ratings.filter(record_date__range=[current_date, week_end])
            if week_ratings.exists():
                dates.append(current_date.strftime('%m/%d'))
                scores.append(round(week_ratings.aggregate(Avg('score'))['score__avg'], 2))
                counts.append(week_ratings.count())
            current_date = week_end + timedelta(days=1)

    elif period == 'monthly':
        months = {}
        counts = {}
        for rating in ratings:
            month_key = rating.record_date.strftime('%b %Y')
            if month_key not in months:
                months[month_key] = []
                counts[month_key] = 0
            months[month_key].append(rating.score)
            counts[month_key] += 1
        dates = list(months.keys())
        scores = [round(sum(vals) / len(vals), 2) for vals in months.values()]
        counts_list = [counts[d] for d in dates]

    else:
        years = {}
        counts = {}
        for rating in ratings:
            year_key = rating.record_date.strftime('%Y')
            if year_key not in years:
                years[year_key] = []
                counts[year_key] = 0
            years[year_key].append(rating.score)
            counts[year_key] += 1
        dates = list(years.keys())
        scores = [round(sum(vals) / len(vals), 2) for vals in years.values()]
        counts_list = [counts[d] for d in dates]

    # ایجاد نمودار یک تکه با ساب‌پلات
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))

    x = np.arange(len(dates))

    # نمودار امتیازات با خط روند (ساده شده)
    ax1.plot(x, scores, marker='o', linewidth=2, markersize=6, color='#1f77b4')

    # خط روند ساده
    if len(scores) > 1:
        z = np.polyfit(x, scores, 1)
        p = np.poly1d(z)
        ax1.plot(x, p(x), '--', linewidth=1.5, color='#d62728', alpha=0.8)

        # اضافه کردن شیب به عنوان متن
        trend_text = f"Trend: {'+' if z[0] > 0 else ''}{z[0]:.2f} per period"
        ax1.text(0.02, 0.95, trend_text, transform=ax1.transAxes, fontsize=9,
                 bbox=dict(boxstyle='round', facecolor='white', alpha=0.7))

    ax1.set_ylim(0, 5.5)
    ax1.set_ylabel('Average Rating', fontsize=10)
    ax1.set_xticks(x)
    ax1.set_xticklabels(dates, rotation=30, ha='right', fontsize=8)
    ax1.set_title(f'{product.Pname} - Rating Trend', fontsize=12, fontweight='bold')
    ax1.grid(True, alpha=0.2, linestyle='--')

    # مقادیر روی نقاط
    for i, s in enumerate(scores):
        ax1.annotate(str(s), (x[i], s), xytext=(0, 8), textcoords='offset points',
                     ha='center', fontsize=8, color='#1f77b4')

    # نمودار تعداد امتیازها
    if period != 'weekly':
        ax2.bar(x, counts_list, color='#2ca02c', alpha=0.7, width=0.6)
        ax2.set_ylabel('Number of Ratings', fontsize=10)
        ax2.set_xlabel('Time Period', fontsize=10)
        for i, c in enumerate(counts_list):
            ax2.annotate(str(c), (x[i], c), xytext=(0, 5), textcoords='offset points',
                         ha='center', fontsize=8)
    else:
        ax2.plot(x, counts, marker='s', linewidth=1.5, markersize=5, color='#ff7f0e')
        ax2.fill_between(x, counts, alpha=0.2, color='#ff7f0e')
        ax2.set_ylabel('Number of Ratings', fontsize=10)
        for i, c in enumerate(counts):
            ax2.annotate(str(c), (x[i], c), xytext=(0, 5), textcoords='offset points',
                         ha='center', fontsize=8)

    ax2.set_xticks(x)
    ax2.set_xticklabels(dates, rotation=30, ha='right', fontsize=8)
    ax2.grid(True, alpha=0.2, linestyle='--')

    plt.tight_layout()

    buffer = BytesIO()
    plt.savefig(buffer, format='png', dpi=120, bbox_inches='tight')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode()
    plt.close()

    return JsonResponse({'chart': image_base64})