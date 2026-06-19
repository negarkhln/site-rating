import matplotlib.pyplot as plt


def draw_final_coverage_chart():
    # داده‌های دقیق استخراج‌شده از آخرین خروجی ترمینال شما (95% Covered , 5% Missing)
    labels = ['Covered Statements\n(95.0%)', 'Missing Lines\n(5.0%)']
    sizes = [95.0, 5.0]

    # رنگ‌بندی استاندارد و مهندسی
    colors = ['#2ecc71', '#e74c3c']  # سبز زمردی برای خطوط پاس شده و قرمز برای Missing
    explode = (0, 0.15)  # ایجاد فاصله برای برجستگی بخش Missing

    plt.figure(figsize=(7, 5.5))

    # رسم نمودار دایره‌ای با سایه و فونت ضخیم
    plt.pie(sizes, explode=explode, labels=labels, colors=colors,
            autopct='%1.1f%%', shadow=True, startangle=140,
            textprops={'fontsize': 11, 'fontweight': 'bold'})

    # عنوان نهایی و تایید شده منطبق بر ترمینال سیستم شما
    plt.title('Final Code Coverage Report - Silver Project\n(14 Test Cases - Terminal Verified Summary)',
              fontsize=12, fontweight='bold', pad=25)

    plt.tight_layout()

    # ذخیره نمودار در دایرکتوری پروژه
    plt.savefig("final_coverage_chart.png", dpi=300)
    print("Chart updated and saved successfully as 'final_coverage_chart.png'!")
    plt.show()


if __name__ == "__main__":
    draw_final_coverage_chart()
