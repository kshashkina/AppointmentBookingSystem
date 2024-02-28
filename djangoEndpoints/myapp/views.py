from django.http import JsonResponse
from bson.objectid import ObjectId
from pymongo import MongoClient

from pymongo.mongo_client import MongoClient

# Replace the placeholder with your Atlas connection string
mongo_uri = "mongodb+srv://kshashkina:UaK417Fcd0Ge337c@project.8ece9nc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&appName=project"

# Create a new client and connect to the server
client = MongoClient(mongo_uri)

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
client = MongoClient(mongo_uri)
db = client['finalProject']
# Получение коллекции из базы данных
# Получение коллекции из базы данных
collection = db['appointments']

# Получение всех документов из коллекции
all_appointments = collection.find()

if all_appointments.count_documents() == 0:
    print("Коллекция пуста.")
else:
    # Просмотр каждого документа
    for appointment in all_appointments:
        print(appointment)


def patient_profile(request):
    try:
        # Ensure you have a valid ObjectId
        if not ObjectId.is_valid('65dd04caaa80827ae808b5a1'):
            return JsonResponse({'error': 'Invalid patient ID'}, status=400)

        # Convert the patient_id to ObjectId
        patient_oid = ObjectId('65dd04caaa80827ae808b5a1')

        patient = db.patients.find({'_id': patient_oid})
        if not patient:
            raise ValueError("Patient not found.")

        # Fetching appointments for the patient
        appointments = list(db.appointments.find({'patient': patient_oid}).sort("appointmentDate", 1))

        # Process appointments to include doctor information and format the date
        formatted_appointments = []
        for appointment in appointments:
            doctor = db.doctors.find_one({'_id': appointment['doctor']})
            appointment_data = {
                'doctor': {
                    'firstName': doctor['firstName'],
                    'lastName': doctor['lastName']
                },
                'appointmentDate': appointment['appointmentDate'].strftime('%Y-%m-%dT%H:%M:%S'),
                'status': appointment['status']
            }
            formatted_appointments.append(appointment_data)

        patient_data = {
            'firstName': patient['firstName'],
            'lastName': patient['lastName'],
            'email': patient['email'],
            'dateOfBirth': patient['dateOfBirth'].strftime('%Y-%m-%d'),
            'gender': patient['gender'],
            'address': patient['address'],
            'phoneNumber': patient['phoneNumber'],
            'registrationDate': patient['registrationDate'].strftime('%Y-%m-%dT%H:%M:%S')
        }

        return JsonResponse({'patient': patient_data, 'appointments': formatted_appointments})
    except ValueError as e:
        return JsonResponse({'error': str(e)}, status=404)
    except Exception as e:
        # For any other exceptions, return a 500 error
        return JsonResponse({'error': 'An error occurred while fetching data', 'details': str(e)}, status=500)