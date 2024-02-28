from django.urls import path
from . import views

urlpatterns = [
    path('api/patient/65dd04caaa80827ae808b5a1/profile/', views.patient_profile, name='patient_profile'),
]

