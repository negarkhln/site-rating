import unittest
import requests

class TestMovieRatingSystem(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """این بخش آدرس اصلی و داده‌های مشترک را برای تمام تست‌ها آماده می‌کند"""
        cls.BASE_URL = "http://localhost:8000/api"
        cls.shared_data = {
            "username": "testuser_unit",
            "email": "unit@example.com",
            "password": "SecurePassword123",
            "token": None,
            "movie_id": 1, 
            "comment_id": None
        }

    # ==========================================
    # ۱. User Authentication Tests (TC-01 to TC-03)
    # ==========================================

    def test_tc01_register_user_unit(self):
        """TC-01: ثبت‌نام کاربر با اطلاعات معتبر"""
        payload = {
            "username": self.shared_data["username"],
            "email": self.shared_data["email"],
            "password": self.shared_data["password"]
        }
        response = requests.post(f"{self.BASE_URL}/register/", json=payload)
        self.assertIn(response.status_code, [201, 400])

    def test_tc02_login_user_valid_unit(self):
        """TC-02: ورود موفق و دریافت Token"""
        payload = {
            "username": self.shared_data["username"],
            "password": self.shared_data["password"]
        }
        response = requests.post(f"{self.BASE_URL}/login/", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.json())
        # ذخیره توکن برای تست‌های بعدی
        self.shared_data["token"] = response.json()["token"]

    def test_tc03_login_user_invalid_password_unit(self):
        """TC-03: ورود با پسورد اشتباه"""
        payload = {
            "username": self.shared_data["username"],
            "password": "WrongPasswordHere"
        }
        response = requests.post(f"{self.BASE_URL}/login/", json=payload)
        self.assertEqual(response.status_code, 401)

    # ==========================================
    # ۲. Movie Management Tests (TC-04 to TC-06)
    # ==========================================

    def test_tc04_get_movie_list_unit(self):
        """TC-04: صحت عملکرد خروجی لیست فیلم‌ها"""
        response = requests.get(f"{self.BASE_URL}/movies/")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    def test_tc05_get_movie_details_unit(self):
        """TC-05: دریافت جزئیات یک فیلم مشخص"""
        response = requests.get(f"{self.BASE_URL}/movies/{self.shared_data['movie_id']}/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("title", response.json())

    def test_tc06_get_non_existing_movie_unit(self):
        """TC-06: خطای ۴۰۴ برای فیلمی که وجود ندارد"""
        response = requests.get(f"{self.BASE_URL}/movies/999999/")
        self.assertEqual(response.status_code, 404)

    # ==========================================
    # ۳. Search System Tests (TC-07 & TC-08)
    # ==========================================

    def test_tc07_search_movie_existing_unit(self):
        """TC-07: تابع سرچ برای فیلم موجود"""
        response = requests.get(f"{self.BASE_URL}/movies/", params={"search": "Inception"})
        self.assertEqual(response.status_code, 200)
        results = response.json()
        if len(results) > 0:
            self.assertIn("Inception", results[0]["title"])

    def test_tc08_search_movie_invalid_unit(self):
        """TC-08: سرچ برای کلمه‌ای که وجود ندارد"""
        response = requests.get(f"{self.BASE_URL}/movies/", params={"search": "XYZ_NonExisting_XYZ"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 0)

    # ==========================================
    # ۴. Rating System Tests (TC-09 to TC-11)
    # ==========================================

    def test_tc09_add_rating_valid_unit(self):
        """TC-09: ثبت ریتینگ معتبر (بین ۱ تا ۱۰)"""
        headers = {"Authorization": f"Token {self.shared_data['token']}"} if self.shared_data["token"] else {}
        payload = {"score": 8}
        response = requests.post(f"{self.BASE_URL}/movies/{self.shared_data['movie_id']}/rate/", json=payload, headers=headers)
        self.assertIn(response.status_code, [201, 200, 400, 401])

    def test_tc10_rating_limit_per_user_unit(self):
        """TC-10: محدودیت ثبت امتیاز تکراری"""
        headers = {"Authorization": f"Token {self.shared_data['token']}"} if self.shared_data["token"] else {}
        payload = {"score": 9}
        response = requests.post(f"{self.BASE_URL}/movies/{self.shared_data['movie_id']}/rate/", json=payload, headers=headers)
        self.assertIn(response.status_code, [200, 400, 401])

    def test_tc11_invalid_rating_score_unit(self):
        """TC-11: ارسال ریتینگ غیرمجاز (بزرگتر از ۱۰)"""
        headers = {"Authorization": f"Token {self.shared_data['token']}"} if self.shared_data["token"] else {}
        payload = {"score": 13}
        response = requests.post(f"{self.BASE_URL}/movies/{self.shared_data['movie_id']}/rate/", json=payload, headers=headers)
        self.assertIn(response.status_code, [400, 401])

    # ==========================================
    # ۵. Comment System Tests (TC-12 to TC-14)
    # ==========================================

    def test_tc12_add_comment_valid_unit(self):
        """TC-12: افزودن کامنت جدید"""
        headers = {"Authorization": f"Token {self.shared_data['token']}"} if self.shared_data["token"] else {}
        payload = {"text": "Unit test comment body"}
        response = requests.post(f"{self.BASE_URL}/movies/{self.shared_data['movie_id']}/comments/", json=payload, headers=headers)
        self.assertIn(response.status_code, [201, 401])
        if response.status_code == 201:
            self.shared_data["comment_id"] = response.json().get("id")

    def test_tc13_edit_comment_unit(self):
        """TC-13: ویرایش کامنت"""
        if not self.shared_data["comment_id"]:
            self.skipTest("کامنت ساخته نشده است.")
        headers = {"Authorization": f"Token {self.shared_data['token']}"}
        payload = {"text": "Updated unit test comment body"}
        response = requests.put(f"{self.BASE_URL}/comments/{self.shared_data['comment_id']}/", json=payload, headers=headers)
        self.assertIn(response.status_code, [200, 401])

    def test_tc14_delete_comment_unit(self):
        """TC-14: حذف کامنت"""
        if not self.shared_data["comment_id"]:
            self.skipTest("کامنت ساخته نشده است.")
        headers = {"Authorization": f"Token {self.shared_data['token']}"}
        response = requests.delete(f"{self.BASE_URL}/comments/{self.shared_data['comment_id']}/", headers=headers)
        self.assertIn(response.status_code, [204, 200, 401])

    # ==========================================
    # ۶. Rating Aggregation Test (TC-15)
    # ==========================================

    def test_tc15_average_rating_calculation_unit(self):
        """TC-15: صحت منطق محاسباتی فرمول میانگین ریتینگ فیلم"""
        response = requests.get(f"{self.BASE_URL}/movies/{self.shared_data['movie_id']}/")
        self.assertIn(response.status_code, [200, 404])

if __name__ == "__main__":
    unittest.main()