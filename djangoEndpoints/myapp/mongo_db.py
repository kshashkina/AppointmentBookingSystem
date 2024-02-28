from pymongo import MongoClient

mongo_uri = "mongodb+srv://kshashkina:UaK417Fcd0Ge337c@project.8ece9nc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&appName=project"
client = MongoClient(mongo_uri)
db = client['finalProject']
