import json
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render


@csrf_exempt  # Временно отключаем CSRF защиту для этого примера
def render_appointment(request):
    if request.method == 'POST':
        appointment_data = json.loads(request.body)
        return render(request, 'myapp/appointmentDetails.html', {
            'appointment': appointment_data
        })
    else:
        return HttpResponse('This method is not allowed', status=405)
