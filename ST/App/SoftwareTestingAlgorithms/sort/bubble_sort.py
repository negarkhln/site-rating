def manual_bubble_sort_by_name(data_list, reverse=False):
    n = len(data_list)
    arr = list(data_list)  # کپی کردن لیست برای حفظ دیتای اصلی

    for i in range(n):
        for j in range(0, n - i - 1):
            name1 = arr[j].Pname.lower() if arr[j].Pname else ""
            name2 = arr[j + 1].Pname.lower() if arr[j + 1].Pname else ""

            # شرط جا‌به‌جایی (مبنای رسم CFG و تست جهش)
            condition = name1 > name2 if not reverse else name1 < name2
            if condition:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr
