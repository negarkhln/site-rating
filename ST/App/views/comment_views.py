from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from App.models import Product, Comment


@login_required
def add_comment(request, product_id):
    product = get_object_or_404(Product, id=product_id)

    if request.method == 'POST':
        text = request.POST.get('text', '').strip()

        if text:
            Comment.objects.create(
                product=product,
                user=request.user,
                text=text
            )
            messages.success(request, 'نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود.')
        else:
            messages.error(request, 'متن نظر نمی‌تواند خالی باشد.')

    return redirect('App:product_detail', product_id=product.id)


@login_required
def delete_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id, user=request.user)
    product_id = comment.product.id
    comment.delete()
    messages.success(request, 'نظر شما حذف شد.')
    return redirect('App:product_detail', product_id=product_id)


@login_required
def edit_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id, user=request.user)

    if request.method == 'POST':
        text = request.POST.get('text', '').strip()
        if text:
            comment.text = text
            comment.save()
            messages.success(request, 'نظر شما با موفقیت ویرایش شد.')
            return redirect('App:product_detail', product_id=comment.product.id)
        else:
            messages.error(request, 'متن نظر نمی‌تواند خالی باشد.')

    return render(request, 'edit_comment.html', {'comment': comment})