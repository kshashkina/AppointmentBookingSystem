const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    dateOfBirth: Date,
    gender: String,
    address: String,
    phoneNumber: String,
    registrationDate: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
