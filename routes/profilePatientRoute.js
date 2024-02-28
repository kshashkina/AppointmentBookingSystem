const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Appointment = require('../models/appoinment');
const Doctor = require("../models/doctor");
const { isAuthenticatedPatient } = require('../middleware/authenticateCheker');
const { formatAppointmentDate } = require('../helpers/dateFormating');


// Logout route
router.get('/logout', (req, res) => {
    // Clear the session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        // Redirect to the login page or any other desired location
        res.redirect('/auth/login');
    });
});

router.get('/profile', isAuthenticatedPatient, async (req, res) => {
    try {
        const patient = await Patient.findById(req.session.user);
        if (!patient) {
            return res.status(404).send('Patient not found');
        }
        const appointments = await Appointment.find({ patient: patient._id }).populate('doctor');
        res.render('patientProfile', { patient, appointments, formatAppointmentDate });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).send({ message: 'Error fetching profile' });
    }
});


// Route to render the page for editing patient data
router.get('/edit', isAuthenticatedPatient, async (req, res) => {
    try {
        const patient = await Patient.findById(req.session.user);
        if (!patient) {
            return res.status(404).send('Patient not found');
        }
        res.render('patientEdit', { patient });
    } catch (error) {
        console.error('Edit patient data error:', error);
        res.status(500).send({ message: 'Error fetching patient data for editing' });
    }
});

router.post('/edit', isAuthenticatedPatient, async (req, res) => {
    try {
        const updatedData = req.body;
        await Patient.findByIdAndUpdate(req.session.user, updatedData);
        res.redirect('/patient/profile');
    } catch (error) {
        console.error('Update patient data error:', error);
        res.status(500).send({ message: 'Error updating patient data' });
    }
});

router.post('/delete', isAuthenticatedPatient, async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.session.user });

        if (appointments.length > 0) {
            for (const appointment of appointments){
                const date = appointment.appointmentDate;
                const doctor = await Doctor.findById(appointment.doctor._id);
                if (doctor) {
                    doctor.takenAppointments = doctor.takenAppointments.filter(takenDate => takenDate.getTime() !== date.getTime());
                    doctor.availableAppointments.push(date);
                    await doctor.save();
                }
            }
            await Appointment.deleteMany({ patient: req.session.user });
        }
        req.session.destroy(() => {
            res.redirect('/auth/login');
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user profile');
    }
});

module.exports = router;
