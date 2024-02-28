const mongoose = require('mongoose');

const mongoDB = 'mongodb+srv://kshashkina:UaK417Fcd0Ge337c@project.8ece9nc.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoDB);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});