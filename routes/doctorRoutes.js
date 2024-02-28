const { isAuthenticatedDoctor } = require("../middleware/authenticateCheker");
const express = require('express');
const router = express.Router();
const Admin = require("../models/admin");
const Doctor = require("../models/doctor");
const Appointment = require('../models/appoinment');
const { formatAppointmentDate } = require("../helpers/dateFormating");

router.get('/dashboard', isAuthenticatedDoctor, async (req, res) => {
    try {
        console.log('Fetching doctor dashboard...');
        const doctor = await Doctor.findById(req.session.user);
        if (!doctor) {
            console.log('Doctor not found.');
            return res.status(404).send('Doctor not found');
        }
        console.log('Fetching appointments for doctor...');
        const appointments = await Appointment.find({ doctor: doctor._id }).populate('patient');
        res.render('doctorDashboard', { doctor: doctor, appointments: appointments, formatAppointmentDate });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).send({ message: 'Error fetching profile' });
    }
});

router.get('/logout', (req, res) => {
    console.log('Logging out doctor...');
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Redirecting to login page...');
        res.redirect('/auth/login');
    });
});

module.exports = router;
