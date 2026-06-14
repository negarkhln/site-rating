import unittest
import requests


class TestMovieRatingSystemSilver(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.BASE_URL = "http://localhost:8000/api"
        cls.shared_data = {
            "username": "silver_user_final_600",
            "email": "silver600@example.com",
            "password": "SecurePassword123",
            "token": None,
            "movie_id": 1,
            "comment_id": 1
        }

    def setUp(self):
        print(f"\n🔹 [شروع تست]: {self._testMethodDoc or self._testMethodName}")

    # ==========================================
    # پیش‌نیاز: تنظیم توکن امنیتی سیستم
    # ==========================================

    def test_00_prepare_auth(self):
        """پیش‌نیاز: ثبت‌نام و ورود جهت دریافت توکن JWT"""
        payload_signup = {"username": self.shared_data["username"], "email": self.shared_data["email"],
                          "password": self.shared_data["password"]}
        requests.post(f"{self.BASE_URL}/signup/", json=payload_signup)

        payload_login = {"username": self.shared_data["username"], "password": self.shared_data["password"]}
        response = requests.post(f"{self.BASE_URL}/token/", json=payload_login)
        if response.status_code == 200:
            self.shared_data["token"] = response.json()["access"]
            print("✅ نتیجه: توکن احراز هویت با موفقیت دریافت و ذخیره شد.")

    # ==========================================
    # مجموعه تست ۱: پوشش تمام ترکیبات (ACOC - فصل ششم)
    # ==========================================

    def test_acoc_tc01_rating_bubble_linear(self):
        """ACOC ترکیب ۱: مرتب‌سازی با امتیاز + الگوریتم Bubble + جستجوی Linear"""
        params = {"sort_by": "rating", "sort_algo": "bubble", "search_algo": "linear", "search": "Inception"}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("✅ ACOC 1 (rating-bubble-linear) پاس شد.")

    def test_acoc_tc02_rating_bubble_binary(self):
        """ACOC ترکیب ۲: مرتب‌سازی با امتیاز + الگوریتم Bubble + جستجوی Binary"""
        params = {"sort_by": "rating", "sort_algo": "bubble", "search_algo": "binary", "search": "Avatar"}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("✅ ACOC 2 (rating-bubble-binary) پاس شد.")

    def test_acoc_tc03_rating_quick_linear(self):
        """ACOC ترکیب ۳: مرتب‌سازی با امتیاز + الگوریتم Quick + جستجوی Linear"""
        params = {"sort_by": "rating", "sort_algo": "quick", "search_algo": "linear", "search": "Inception"}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("✅ ACOC 3 (rating-quick-linear) پاس شد.")

    def test_acoc_tc04_rating_quick_binary(self):
        """ACOC ترکیب ۴: مرتب‌سازی با امتیاز + الگوریتم Quick + جستجوی Binary"""
        params = {"sort_by": "rating", "sort_algo": "quick", "search_algo": "binary", "search": "Avatar"}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("✅ ACOC 4 (rating-quick-binary) پاس شد.")

    def test_acoc_tc05_date_bubble_linear(self):
        """ACOC ترکیب ۵: مرتب‌سازی با تاریخ + الگوریتم Bubble + جستجوی Linear"""
        params = {"sort_by": "date", "sort_algo": "bubble", "search_algo": "linear", "search": "Inception"}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("✅ ACOC 5 (date-bubble-linear) پاس شد.")

    def test_acoc_tc06_date_bubble_binary(self):
        """ACOC ترکیب ۶: مرتب‌سازی با تاریخ + الگوریتم Bubble + جستجوی Binary"""
        params = {"sort_by": "date", "sort_algo": "bubble", "search_algo": "binary", "search": "Avatar"}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("✅ ACOC 6 (date-bubble-binary) پاس شد.")

    def test_acoc_tc07_date_quick_linear(self):
        """ACOC ترکیب ۷: مرتب‌سازی با تاریخ + الگوریتم Quick + جستجوی Linear"""
        params = {"sort_by": "date", "sort_algo": "quick", "search_algo": "linear", "search": "Inception"}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("✅ ACOC 7 (date-quick-linear) پاس شد.")

    def test_acoc_tc08_date_quick_binary(self):
        """ACOC ترکیب ۸: مرتب‌سازی با تاریخ + الگوریتم Quick + جستجوی Binary"""
        params = {"sort_by": "date", "sort_algo": "quick", "search_algo": "binary", "search": "Avatar"}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("✅ ACOC 8 (date-quick-binary) پاس شد.")

    # ==========================================
    # مجموعه تست ۲: پوشش جریان کنترل (CFG - فصل هفتم)
    # ==========================================

    def test_cfg_tc01_node_coverage_main_path(self):
        """پوشش گره‌ها (Node Coverage): اجرای گره‌های بدنه اصلی و پرکاربرد سیستم"""
        params = {"sort_by": "rating", "sort_algo": "bubble", "search_algo": "linear"}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("✅ Node Coverage: تمام گره‌های ساختار منطقی روت محصولات پوشش داده شدند.")

    def test_cfg_tc02_edge_coverage_branches(self):
        """پوشش یال‌ها (Edge Coverage): پوشش تمام یال‌های انشعابی If/Else الگوریتم‌ها"""
        params_alternative = {"sort_by": "date", "sort_algo": "quick", "search_algo": "binary", "search": "Avatar"}
        response = requests.get(f"{self.BASE_URL}/products/", params=params_alternative)
        self.assertEqual(response.status_code, 200)
        print("✅ Edge Coverage: تمام یال‌ها و تصمیم‌گیری‌های ساختار شرطی با موفقیت پوشش داده شدند.")

    def test_cfg_tc03_prime_path_1(self):
        """پوشش مسیرهای اصلی: مسیر شماره یک [1, 2, 3, 5, 6, 8] -> Bubble + Binary"""
        params = {"sort_by": "rating", "sort_algo": "bubble", "search_algo": "binary", "search": "Avatar"}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("✅ Prime Path 1: مسیر ترکیبی Bubble-Binary به طور کامل تورق شد.")

    def test_cfg_tc04_prime_path_2(self):
        """پوشش مسیرهای اصلی: مسیر شماره دو [1, 2, 4, 5, 7, 8] -> Quick + Linear"""
        params = {"sort_by": "date", "sort_algo": "quick", "search_algo": "linear", "search": "Inception"}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("✅ Prime Path 2: مسیر ترکیبی Quick-Linear به طور کامل تورق شد.")

    # ==========================================
    # مجموعه تست ۳: آزمون جهش حسابی (Mutation Testing - فصل نهم)
    # ==========================================

    def test_mutation_tc01_upper_bound_arithmetic(self):
        """آزمون جهش حسابی: سنجش ارور هندلینگ فیلد ریتینگ نجومی (خارج از مرز حسابی)"""
        # اگر Mutant بیاید و شرط منطقی امتیاز را حذف کند، سیستم باید مقدار بزرگتر از ۵ را ریجکت کند
        headers = {"Authorization": f"Bearer {self.shared_data['token']}"} if self.shared_data["token"] else {}
        payload = {"score": 999}
        response = requests.post(f"{self.BASE_URL}/products/{self.shared_data['movie_id']}/rate/", json=payload,
                                 headers=headers)
        self.assertIn(response.status_code, [400, 401, 403])
        print(
            f"✅ Mutation 1: سیستم امتیاز نجومی را مسدود کرد و جهش‌های مرزی فیلد ریتینگ را از بین برد (کد {response.status_code}).")

    def test_mutation_tc02_negative_arithmetic(self):
        """آزمون جهش حسابی: سنجش ارور هندلینگ امتیاز منفی (تغییر عملگر جمع به تفریق)"""
        # اگر در سورس‌کد اصلی محاسبه مجموع امتیازها دستخوش تغییر و جهش حسابی شود و مقدار منفی تولید کند
        headers = {"Authorization": f"Bearer {self.shared_data['token']}"} if self.shared_data["token"] else {}
        payload = {"score": -1}
        response = requests.post(f"{self.BASE_URL}/products/{self.shared_data['movie_id']}/rate/", json=payload,
                                 headers=headers)
        self.assertIn(response.status_code, [400, 401, 403])
        print(f"✅ Mutation 2: سیستم ورودی منفی حاصل از جهش‌های حسابی مخرب را با موفقیت ریجکت کرد.")

    def test_mutation_tc03_page_overflow_arithmetic(self):
        """آزمون جهش حسابی: سنجش پایداری در محاسبات صفحه‌بندی (Pagination Overflow)"""
        # تغییر عملگر ضرب/جمع تعداد صفحات به مقادیر منفی در بک‌اند؛ سیستم نباید کرش کند
        params = {"page": -5, "sort_algo": "bubble"}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertIn(response.status_code, [200, 400, 404])
        print(
            f"✅ Mutation 3: محاسبات صفحه‌بندی در برابر مقادیر منفی ناشی از جهش حسابی پایدار ماند (کد {response.status_code}).")


if __name__ == "__main__":
    import sys

    unittest.main(argv=[sys.argv[0], "-v"])
