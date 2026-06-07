from django import forms

class PhoneResetForm(forms.Form):
    phone_or_username = forms.CharField(
        label="نام کاربری",
        max_length=100,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'نام کاربری خود را وارد کنید'})
    )