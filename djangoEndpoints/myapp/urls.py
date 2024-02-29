from django.urls import path
from . import views

urlpatterns = [
    path('api/render_appointment/', views.render_appointment, name='render_appointment'),
]

