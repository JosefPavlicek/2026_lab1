from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from .models import Reservation
from .forms import ReservationForm


class ReservationListView(ListView):
    model = Reservation
    template_name = 'reservations/reservation_list.html'
    context_object_name = 'reservations'

    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.GET.get('status')
        q = self.request.GET.get('q')
        if status:
            queryset = queryset.filter(status=status)
        if q:
            queryset = queryset.filter(customer_name__icontains=q) | queryset.filter(car_model__icontains=q)
        return queryset


class ReservationDetailView(DetailView):
    model = Reservation
    template_name = 'reservations/reservation_detail.html'


class ReservationCreateView(CreateView):
    model = Reservation
    form_class = ReservationForm
    template_name = 'reservations/reservation_form.html'
    success_url = reverse_lazy('reservation-list')


class ReservationUpdateView(UpdateView):
    model = Reservation
    form_class = ReservationForm
    template_name = 'reservations/reservation_form.html'
    success_url = reverse_lazy('reservation-list')


class ReservationDeleteView(DeleteView):
    model = Reservation
    template_name = 'reservations/reservation_confirm_delete.html'
    success_url = reverse_lazy('reservation-list')
