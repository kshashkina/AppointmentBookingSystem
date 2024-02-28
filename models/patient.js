const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    dateOfBirth: Date,
    gender: String,
    address: String,
    phoneNumber: String,
    registrationDate: { type: Date, default: Date.now },
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }]
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
