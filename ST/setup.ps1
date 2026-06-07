# setup.ps1 - نصب خودکار پروژه سینما جنگو

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Cinema Django - Project Setup" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/5] Creating virtual environment..." -ForegroundColor Green
python -m venv .venv

Write-Host "[2/5] Activating virtual environment..." -ForegroundColor Green
.venv\Scripts\Activate.ps1

Write-Host "[3/5] Installing packages..." -ForegroundColor Green
pip install django==4.2.20 pillow python-slugify

Write-Host "[4/5] Running migrations..." -ForegroundColor Green
python manage.py migrate

Write-Host "[5/5] Loading sample data..." -ForegroundColor Green
python manage.py loaddata products_sample.json

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup completed successfully!" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the server, run:" -ForegroundColor White
Write-Host "  .venv\Scripts\Activate.ps1" -ForegroundColor Cyan
Write-Host "  python manage.py runserver" -ForegroundColor Cyan
Write-Host ""
Write-Host "Admin user can be created with:" -ForegroundColor White
Write-Host "  python manage.py createsuperuser" -ForegroundColor Cyan
Write-Host ""