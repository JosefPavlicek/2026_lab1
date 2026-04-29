# Django Tire Reservation App

Jednoduchá výuková Django CRUD aplikace pro rezervaci přezutí pneumatik.

## Funkce

- vytvoření rezervace
- výpis rezervací
- detail rezervace
- úprava rezervace
- smazání rezervace
- filtrování podle stavu
- vyhledávání podle zákazníka nebo auta
- administrační rozhraní Django Admin

## Spuštění lokálně nebo v GitHub Codespaces

```bash
python -m pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

Aplikace poběží na portu `8000`.

## Struktura

```text
tire_reservation_django/
├── manage.py
├── requirements.txt
├── tire_reservation/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
└── reservations/
    ├── models.py
    ├── forms.py
    ├── views.py
    ├── urls.py
    ├── admin.py
    ├── templates/reservations/
    └── static/reservations/
```

## Náměty pro studenty

1. Přidat kontrolu pracovní doby pneuservisu.
2. Zakázat rezervaci termínu v minulosti.
3. Přidat přihlášení pro administrátora.
4. Přidat export rezervací do CSV.
5. Přidat REST API pomocí Django REST Framework.
