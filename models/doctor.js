const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    password: String,
    specialization: String,
    workSchedule: [String],
    roomNumber: String,
    email: String,
    registrationDate: { type: Date, default: Date.now },
    availableAppointments: [{ type: Date }],
    takenAppointments: [{ type: Date }]
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
