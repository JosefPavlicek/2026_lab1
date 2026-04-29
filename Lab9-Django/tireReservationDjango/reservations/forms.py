from django import forms
from .models import Reservation


class ReservationForm(forms.ModelForm):
    class Meta:
        model = Reservation
        fields = [
            'customer_name', 'email', 'phone', 'car_model', 'tire_size',
            'service_type', 'reservation_date', 'reservation_time', 'status', 'note'
        ]
        widgets = {
            'reservation_date': forms.DateInput(attrs={'type': 'date'}),
            'reservation_time': forms.TimeInput(attrs={'type': 'time'}),
            'note': forms.Textarea(attrs={'rows': 3}),
        }
