from django.db import models


class Reservation(models.Model):
    SERVICE_CHOICES = [
        ('change', 'Přezutí pneumatik'),
        ('balance', 'Vyvážení kol'),
        ('storage', 'Uskladnění pneumatik'),
        ('check', 'Kontrola tlaku a stavu'),
    ]

    STATUS_CHOICES = [
        ('new', 'Nová'),
        ('confirmed', 'Potvrzená'),
        ('done', 'Dokončená'),
        ('cancelled', 'Zrušená'),
    ]

    customer_name = models.CharField('Jméno zákazníka', max_length=120)
    email = models.EmailField('E-mail')
    phone = models.CharField('Telefon', max_length=30)
    car_model = models.CharField('Auto', max_length=120)
    tire_size = models.CharField('Rozměr pneumatik', max_length=50, blank=True)
    service_type = models.CharField('Služba', max_length=20, choices=SERVICE_CHOICES)
    reservation_date = models.DateField('Datum rezervace')
    reservation_time = models.TimeField('Čas rezervace')
    status = models.CharField('Stav', max_length=20, choices=STATUS_CHOICES, default='new')
    note = models.TextField('Poznámka', blank=True)
    created_at = models.DateTimeField('Vytvořeno', auto_now_add=True)

    class Meta:
        ordering = ['reservation_date', 'reservation_time']
        constraints = [
            models.UniqueConstraint(
                fields=['reservation_date', 'reservation_time'],
                name='unique_reservation_slot'
            )
        ]

    def __str__(self):
        return f'{self.customer_name} – {self.reservation_date} {self.reservation_time}'
