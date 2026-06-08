from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from App.models import Product, WatchList


# اگر سریالایزر داری ایمپورت کن، در غیر این صورت دستی دیتای محصول را می‌سازیم

class WatchlistAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """دریافت کل لیست تماشای کاربر"""
        items = WatchList.objects.filter(user=request.user).select_related('product')
        data = []
        for item in items:
            data.append({
                'id': item.id,
                'status': item.status,
                'product': {
                    'id': item.product.id,
                    'Pname': item.product.Pname,
                    'genre': getattr(item.product, 'genre', '')  # اگر فیلد ژانر وجود دارد
                }
            })
        return Response(data)

    def post(self, request, product_id):
        """اضافه کردن یا به‌روزرسانی وضعیت یک محصول در لیست"""
        product = get_object_or_404(Product, id=product_id)
        new_status = request.data.get('status', 'planning')

        if new_status not in ['watching', 'completed', 'planning', 'favorite']:
            return Response({'error': 'وضعیت نامعتبر است'}, status=status.HTTP_400_BAD_REQUEST)

        watchlist_item, created = WatchList.objects.get_or_create(
            user=request.user,
            product=product,
            defaults={'status': new_status}
        )

        if not created:
            watchlist_item.status = new_status
            watchlist_item.save()

        return Response({'message': 'لیست تماشا با موفقیت به‌روزرسانی شد'}, status=status.HTTP_200_OK)

    def delete(self, request, product_id):
        """حذف محصول از لیست تماشا"""
        product = get_object_or_404(Product, id=product_id)
        watchlist_item = WatchList.objects.filter(user=request.user, product=product).first()

        if watchlist_item:
            watchlist_item.delete()
            return Response({'message': 'محصول از لیست تماشای شما حذف شد'}, status=status.HTTP_200_OK)
        return Response({'error': 'محصول در لیست شما یافت نشد'}, status=status.HTTP_404_NOT_FOUND)
