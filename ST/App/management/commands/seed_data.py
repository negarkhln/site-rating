import os
import random
import requests
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.core.files.base import ContentFile
from django.utils import timezone
from django.db import transaction
from django.db.models import F

from App.models import Category, UserProfile, Product, Comment, Rating, Season

# تنظیمات اصلی TMDB
TMDB_API_KEY = "e37ada4fe3c24d1d33a01adf389d4832"
BASE_URL = "https://api.themoviedb.org/3"
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

FIRST_NAMES = ['علی', 'رضا', 'محمد', 'حسین', 'مهدی', 'سارا', 'مریم', 'زهرا', 'نیلوفر', 'امیر', 'امید', 'سامان', 'آرمین',
               'الناز', 'پگاه']
LAST_NAMES = ['احمدی', 'رضایی', 'محمدی', 'حسینی', 'کریمی', 'امینی', 'رحیمی', 'صادقی', 'هاشمی', 'موسوی', 'مرادی', 'نظری',
              'زارع']

COMMENTS_BANK = {
    1: ["اصلا خوب نبود، وقتتونو تلف نکنید.", "خیلی ضعیف بود، داستان هیچ کششی نداشت.", "بدترین چیزی بود که امسال دیدم."],
    2: ["به شدت ناامیدکننده بود.", "بازی‌ها ضعیف و ریتم داستان کند بود.", "ایده خوبی داشت ولی خیلی بد اجرا شده بود."],
    3: ["معمولی بود، برای یک بار دیدن بد نیست.", "متوسط بود، نکات مثبت و منفی رو با هم داشت.",
        "سرگرم‌کننده بود ولی شاهکار نبود."],
    4: ["فوق‌العاده بود! به شدت پیشنهاد می‌کنم.", "داستان بی‌نظیر و کارگردانی قوی داشت.",
        "از دیدنش واقعا لذت بردم، حتما ببینید."],
    5: ["یک شاهکار واقعی! بازیگری‌ها عالی بود.", "بی‌نقص، جذاب و تاثیرگذار.",
        "بهترین فیلم/سریالی که تا حالا دیدم، حتماً تماشا کنید."]
}


class Command(BaseCommand):
    help = "Seeds the database with realistic data from TMDB API"

    def handle(self, *args, **options):
        if TMDB_API_KEY == "YOUR_TMDB_API_KEY_HERE" or not TMDB_API_KEY:
            self.stderr.write(self.style.ERROR("لطفاً ابتدا TMDB_API_KEY معتبر را در اسکریپت وارد کنید."))
            return

        self.stdout.write(self.style.WARNING("=== شروع فرآیند تزریق داده‌ها ==="))

        session = requests.Session()
        session.params = {'api_key': TMDB_API_KEY, 'language': 'en-US'}

        with transaction.atomic():
            # ۱. ایجاد دسته‌بندی‌ها
            movie_cat, _ = Category.objects.get_or_create(name="فیلم", defaults={"description": "بخش فیلم‌های سینمایی"})
            tv_cat, _ = Category.objects.get_or_create(name="سریال",
                                                       defaults={"description": "بخش مجموعه‌های تلویزیونی"})

            movie_cat.save()
            tv_cat.save()
            self.stdout.write(self.style.SUCCESS("دسته‌بندی‌های 'فیلم' و 'سریال' تایید شدند."))

            # ۲. ایجاد ۱۰۰ کاربر واقعی با پسورد ثابت
            self.stdout.write("در حال ایجاد ۱۰۰ کاربر واقعی...")
            all_users = []
            created_usernames = set()

            for _ in range(100):
                first = random.choice(FIRST_NAMES)
                last = random.choice(LAST_NAMES)
                username = f"{first}_{last}_{random.randint(10, 999)}"

                while username in created_usernames:
                    username = f"{first}_{last}_{random.randint(10, 999)}"
                created_usernames.add(username)

                user = User(username=username, first_name=first, last_name=last, email=f"{username}@example.com")
                user.set_password("fakeUser123456")
                all_users.append(user)

            User.objects.bulk_create(all_users)

            # واکشی دقیق کاربران ساخته‌شده (بدون تداخل با کاربران قدیمی دیتابیس)
            inserted_users = User.objects.filter(username__in=created_usernames)

            profiles_to_create = [UserProfile(user=u) for u in inserted_users if not hasattr(u, 'userprofile')]
            if profiles_to_create:
                UserProfile.objects.bulk_create(profiles_to_create)

            # واکشی نهایی کاربران به همراه پروفایل‌ها به صورت بهینه شده
            db_users = list(User.objects.filter(username__in=created_usernames).select_related('userprofile'))
            all_profiles = [u.userprofile for u in db_users]

            # اعمال منطق کاربر قدیمی روی ۵۰٪ آن‌ها
            old_profiles_sampled = random.sample(all_profiles, k=50)
            old_profile_ids = [p.id for p in old_profiles_sampled]

            ten_days_ago = timezone.now().date() - timedelta(days=15)
            UserProfile.objects.filter(id__in=old_profile_ids).update(
                join_date=ten_days_ago,
                login_count=12
            )
            self.stdout.write(self.style.SUCCESS("۱۰۰ کاربر ایجاد و ۵۰٪ آن‌ها به عنوان کاربر قدیمی تنظیم شدند."))

            # ۳ و ۴. دریافت فیلم‌ها و سریال‌ها (هر کدام ۱۰۰ مورد واقعی)
            self.stdout.write("در حال دریافت ۱۰۰ فیلم محبوب از TMDB...")
            movies_created = self.fetch_and_store_products(session, "movie", movie_cat, 100)

            self.stdout.write("در حال دریافت ۱۰۰ سریال محبوب از TMDB...")
            series_created = self.fetch_and_store_products(session, "tv", tv_cat, 100)

            # ۵. سیستم کامنت و امتیازدهی هوشمند
            self.stdout.write("در حال ثبت نظرات و امتیازات هوشمند...")
            all_products = movies_created + series_created

            for product in all_products:
                ratings_count = random.randint(5, 15)
                selected_users = random.sample(db_users, k=ratings_count)

                for user in selected_users:
                    score = random.randint(1, 5)
                    text = random.choice(COMMENTS_BANK[score])

                    Rating.objects.create(product=product, user=user, score=score)
                    Comment.objects.create(product=product, user=user, text=text, is_active=True)

                    UserProfile.objects.filter(user=user).update(
                        total_ratings_count=F('total_ratings_count') + 1,
                        sum_of_scores=F('sum_of_scores') + score
                    )

            # ۶. محاسبه نهایی امتیاز وزندار
            self.stdout.write("در حال محاسبه نهایی امتیاز وزندار محصولات...")
            for product in all_products:
                product.calculate_weighted_rating()

        self.stdout.write(self.style.SUCCESS("=== فرآیند Seeding با موفقیت کامل به پایان رسید! ==="))

    def fetch_and_store_products(self, session, endpoint_type, category, total_count):
        products_list = []
        page = 1
        count_fetched = 0

        while count_fetched < total_count:
            try:
                url = f"{BASE_URL}/{endpoint_type}/popular"
                response = session.get(url, params={'page': page}, timeout=10)
                if response.status_code != 200:
                    break

                results = response.json().get('results', [])
                if not results:
                    break

                for item in results:
                    if count_fetched >= total_count:
                        break

                    tmdb_id = item.get('id')
                    p_name = item.get('title') if endpoint_type == "movie" else item.get('name')
                    overview = item.get('overview', '')
                    raw_date = item.get('release_date') if endpoint_type == "movie" else item.get('first_air_date')

                    release_date = None
                    if raw_date:
                        try:
                            release_date = timezone.datetime.strptime(raw_date, "%Y-%m-%d").date()
                        except ValueError:
                            pass

                    product = Product(
                        Pname=p_name,
                        category=category,
                        description=overview[:500],
                        storyline=overview,
                        release_date=release_date,
                        imdb_rating=item.get('vote_average'),
                        status='published',
                        views_count=random.randint(100, 5000),
                        download_count=random.randint(10, 1000)
                    )

                    product.download_url = f"https://dl.yourdomain.com/storage/{product.PCode}/main_quality.mp4"
                    product.save()

                    # دانلود واقعی پوستر
                    poster_path = item.get('poster_path')
                    if poster_path:
                        try:
                            img_url = f"{IMAGE_BASE_URL}{poster_path}"
                            img_res = requests.get(img_url, timeout=5)
                            if img_res.status_code == 200:
                                product.poster.save(f"{product.PCode}.jpg", ContentFile(img_res.content), save=False)
                                product.save(update_fields=['poster'])
                        except Exception:
                            pass

                    # استخراج جزئیات فصل‌ها برای سریال‌ها
                    if endpoint_type == "tv":
                        try:
                            detail_url = f"{BASE_URL}/tv/{tmdb_id}"
                            detail_res = session.get(detail_url, timeout=5)
                            if detail_res.status_code == 200:
                                seasons_data = detail_res.json().get('seasons', [])
                                for s in seasons_data:
                                    s_number = s.get('season_number', 0)
                                    ep_count = s.get('episode_count', 0)
                                    if s_number > 0 and ep_count > 0:
                                        Season.objects.create(
                                            series=product,
                                            season_number=s_number,
                                            episode_count=ep_count,
                                            imdb_rating=s.get('vote_average') or product.imdb_rating
                                        )
                        except Exception:
                            pass

                    products_list.append(product)
                    count_fetched += 1

                page += 1
            except Exception as e:
                self.stderr.write(f"خطا در دریافت داده‌ها از صفحه {page}: {str(e)}")
                break

        return products_list
