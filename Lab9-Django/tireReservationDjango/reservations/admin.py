from django.contrib import admin
from .models import Reservation


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'car_model', 'service_type', 'reservation_date', 'reservation_time', 'status')
    list_filter = ('status', 'service_type', 'reservation_date')
    search_fields = ('customer_name', 'email', 'phone', 'car_model')
