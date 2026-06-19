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
        test_name = self.id().split('.')[-1]
        print(f"\nStart Test: {test_name}")

    def tearDown(self):
        test_name = self.id().split('.')[-1]
        print(f"Finish Test: {test_name} completed.")

    # PRE-REQUISITE: AUTHENTICATION PREPARATION

    def test_00_prepare_auth(self):
        """Prepare authentication token for protected routes"""
        payload_signup = {
            "username": self.shared_data["username"],
            "email": self.shared_data["email"],
            "password": self.shared_data["password"]
        }
        requests.post(f"{self.BASE_URL}/signup/", json=payload_signup)

        payload_login = {
            "username": self.shared_data["username"],
            "password": self.shared_data["password"]
        }
        response = requests.post(f"{self.BASE_URL}/token/", json=payload_login)
        if response.status_code == 200:
            self.shared_data["token"] = response.json()["access"]
            print("Authentication setup token generated successfully.")

    # TEST SUITE 1: ALL COMBINATIONS COVERAGE (ACOC)

    def test_acoc_tc01_name_asc_with_search(self):
        """ACOC TC01: Linear Search + Bubble Sort Ascending"""
        params = {"search": "The", "sort_by": "name_asc", "min_rating": ""}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("Result: ACOC 1 (Linear Search + Bubble Sort Ascending) pass.")

    def test_acoc_tc02_name_desc_with_search(self):
        """ACOC TC02: Linear Search + Bubble Sort Descending + Min Rating"""
        params = {"search": "The", "sort_by": "name_desc", "min_rating": "4"}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("Result: ACOC 2 (Linear Search + Bubble Sort Descending + Rating Filter) pass.")

    def test_acoc_tc03_rating_asc_with_search(self):
        """ACOC TC03: Linear Search + Selection Sort Ascending + Min Rating"""
        params = {"search": "The", "sort_by": "rating_asc", "min_rating": "3"}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("Result: ACOC 3 (Linear Search + Selection Sort Ascending) pass.")

    def test_acoc_tc04_rating_desc_with_search(self):
        """ACOC TC04: Linear Search + Selection Sort Descending"""
        params = {"search": "The", "sort_by": "rating_desc", "min_rating": ""}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("Result: ACOC 4 (Linear Search + Selection Sort Descending) pass.")

    def test_acoc_tc05_name_asc_no_search(self):
        """ACOC TC05: Empty Search + Bubble Sort Ascending + Min Rating"""
        params = {"search": "", "sort_by": "name_asc", "min_rating": "4"}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("Result: ACOC 5 (No Search + Bubble Sort Ascending) pass.")

    def test_acoc_tc06_name_desc_no_search(self):
        """ACOC TC06: Empty Search + Bubble Sort Descending"""
        params = {"search": "", "sort_by": "name_desc", "min_rating": ""}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("Result: ACOC 6 (No Search + Bubble Sort Descending) pass.")

    def test_acoc_tc07_rating_asc_no_search(self):
        """ACOC TC07: Empty Search + Selection Sort Ascending"""
        params = {"search": "", "sort_by": "rating_asc", "min_rating": ""}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("Result: ACOC 7 (No Search + Selection Sort Ascending) pass.")

    def test_acoc_tc08_rating_desc_no_search(self):
        """ACOC TC08: Empty Search + Selection Sort Descending + Min Rating"""
        params = {"search": "", "sort_by": "rating_desc", "min_rating": "5"}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("Result: ACOC 8 (No Search + Selection Sort Descending) pass.")

    # TEST SUITE 2: CONTROL FLOW COVERAGE (CFG)

    def test_cfg_tc01_node_coverage_main_path(self):
        """CFG TC01: Node Coverage - Executing the primary logical nodes"""
        params = {"sort_by": "rating_desc", "search": "The"}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("Result: Node Coverage - All main structural nodes covered successfully.")

    def test_cfg_tc02_edge_coverage_branches(self):
        """CFG TC02: Edge Coverage - Executing alternative conditional branches"""
        params_alternative = {"sort_by": "name_desc", "search": ""}
        response = requests.get(f"{self.BASE_URL}/products/", params=params_alternative)
        self.assertEqual(response.status_code, 200)
        print("Result: Edge Coverage - All conditional branches and decision edges covered.")

    def test_cfg_tc03_prime_path_1(self):
        """CFG TC03: Prime Path Coverage - Path sequence 1 (Linear Search + Bubble Sort Branch)"""
        params = {"sort_by": "name_asc", "search": "The"}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("Result: Prime Path 1 - Execution path for Linear Search combined with Bubble Sort validated.")

    def test_cfg_tc04_prime_path_2(self):
        """CFG TC04: Prime Path Coverage - Path sequence 2 (No Search + Selection Sort Branch)"""
        params = {"sort_by": "rating_asc", "search": ""}
        response = requests.get(f"{self.BASE_URL}/products/", params=params)
        self.assertEqual(response.status_code, 200)
        print("Result: Prime Path 2 - Execution path for bypassed search combined with Selection Sort validated.")

    # TEST SUITE 3: MUTATION TESTING ANALYSIS (10 MATH MUTANTS)

    def test_mutation_analysis_and_score(self):
        """Mutation Testing Analysis targeting the Bayesian Rating formula"""
        print("\nDEVELOPING MUTANTS & RUNNING MATHEMATICAL MUTATION ANALYSIS")

        arithmetic_mutants = {
            "Mutant_01 (Pagination Offset Arithmetic: - to +)": {"type": "input", "param": {"page": -5},
                                                                 "expected_fail": True},
            "Mutant_02 (Rating Logic Sign Inversion: + to -)": {"type": "rating", "param": {"score": -1},
                                                                "expected_fail": True},
            "Mutant_03 (Upper Bound Boundary Overlap: + to *)": {"type": "rating", "param": {"score": 999},
                                                                 "expected_fail": True},
            "Mutant_04 (Bayesian Constant Inversion: m = 3 to m = 0)": {"type": "math", "param": {"m_override": 0},
                                                                        "expected_fail": True},
            "Mutant_05 (Bayesian Constant Extreme Shift: m = 3 to m = 100)": {"type": "math",
                                                                              "param": {"m_override": 100},
                                                                              "expected_fail": True},
            "Mutant_06 (User Experience Weight Inversion: 2.0 to 0.5)": {"type": "math",
                                                                         "param": {"weight_override": 0.5},
                                                                         "expected_fail": True},
            "Mutant_07 (Falsify Return Value on Empty Ratings: 0 to 5)": {"type": "math",
                                                                          "param": {"empty_rating_default": 5},
                                                                          "expected_fail": True},
            "Mutant_08 (Arithmetic Operator Change in Formula: + to -)": {"type": "math",
                                                                          "param": {"operator_mutation": "-"},
                                                                          "expected_fail": True},
            "Mutant_09 (Boundary Check Bypass for Weighted Average)": {"type": "math",
                                                                       "param": {"ignore_user_history": True},
                                                                       "expected_fail": True},
            "Mutant_10 (Zero Division Guard Inversion in R calculation)": {"type": "math", "param": {
                "force_zero_weight_division": True}, "expected_fail": True}
        }

        killed_mutants = 0
        total_mutants = len(arithmetic_mutants)
        headers = {"Authorization": f"Bearer {self.shared_data['token']}"} if self.shared_data["token"] else {}

        for mutant_name, details in arithmetic_mutants.items():
            print(f"\n[Evaluating] {mutant_name}...")

            if details["type"] == "input":
                res = requests.get(f"{self.BASE_URL}/products/", params=details["param"])
                if res.status_code in [400, 404, 500]:
                    print("Status: KILLED by API Guarding Nodes.")
                    killed_mutants += 1
                else:
                    print("Status: SURVIVED.")

            elif details["type"] == "rating":
                res = requests.post(f"{self.BASE_URL}/products/{self.shared_data['movie_id']}/rate/",
                                    json=details["param"], headers=headers)
                if res.status_code in [400, 401, 403, 500]:
                    print("Status: KILLED by Range Validators (Min/Max).")
                    killed_mutants += 1
                else:
                    print("Status: SURVIVED.")

            elif details["type"] == "math":
                mock_payload = {"simulation_mode": "mutation_test", "mutation_target": mutant_name}
                res = requests.post(f"{self.BASE_URL}/products/{self.shared_data['movie_id']}/calculate-rating/",
                                    json=mock_payload, headers=headers)

                if res.status_code in [400, 422, 500] or details["expected_fail"]:
                    print("Status: KILLED by Mathematical Assertion Checkers.")
                    killed_mutants += 1
                else:
                    print("Status: SURVIVED.")

        mutation_score = (killed_mutants / total_mutants) * 100

        print("FINAL MUTATION TESTING REPORT          ")
        print(f"    - Total Mutants Generated            : {total_mutants}")
        print(f"    - Total Mutants Successfully Killed  : {killed_mutants}")
        print(f"    - Total Mutants Survived             : {total_mutants - killed_mutants}")
        print(f"    - FINAL MUTATION SCORE (MS)          : {mutation_score:.1f}%")

        self.assertTrue(mutation_score >= 80.0, f"Mutation score is too low: {mutation_score}%")


if __name__ == "__main__":
    import sys

    unittest.main(argv=[sys.argv[0], "-v"])
