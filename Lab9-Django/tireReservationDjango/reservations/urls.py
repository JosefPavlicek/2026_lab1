from django.urls import path
from .views import (
    ReservationListView, ReservationDetailView, ReservationCreateView,
    ReservationUpdateView, ReservationDeleteView
)

urlpatterns = [
    path('', ReservationListView.as_view(), name='reservation-list'),
    path('new/', ReservationCreateView.as_view(), name='reservation-create'),
    path('<int:pk>/', ReservationDetailView.as_view(), name='reservation-detail'),
    path('<int:pk>/edit/', ReservationUpdateView.as_view(), name='reservation-update'),
    path('<int:pk>/delete/', ReservationDeleteView.as_view(), name='reservation-delete'),
]
