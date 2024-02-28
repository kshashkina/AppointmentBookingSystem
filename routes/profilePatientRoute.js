const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Appointment = require('../models/appoinment');
const Doctor = require("../models/doctor");
const { isAuthenticatedPatient } = require('../middleware/authenticateCheker');
const { formatAppointmentDate } = require('../helpers/dateFormating');
const Admin = require("../models/admin");

router.get('/logout', (req, res) => {
    console.log('Logging out patient...');
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Redirecting to login page...');
        res.redirect('/auth/login');
    });
});

router.get('/profile', isAuthenticatedPatient, async (req, res) => {
    console.log('Fetching patient profile...');
    try {
        const patient = await Patient.findById(req.session.user);
        if (!patient) {
            console.error('Patient not found.');
            return res.status(404).send('Patient not found');
        }
        console.log('Fetching appointments for patient...');
        const appointments = await Appointment.find({ patient: patient._id }).populate('doctor');
        res.render('patientProfile', { patient, appointments, formatAppointmentDate });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).send({ message: 'Error fetching profile' });
    }
});

router.get('/edit', isAuthenticatedPatient, async (req, res) => {
    try {
        const patient = await Patient.findById(req.session.user);
        if (!patient) {
            console.error('Patient not found.');
            return res.status(404).send('Patient not found');
        }
        res.render('patientEdit', { patient });
    } catch (error) {
        console.error('Edit patient data error:', error);
        res.status(500).send({ message: 'Error fetching patient data for editing' });
    }
});

router.post('/edit', isAuthenticatedPatient, async (req, res) => {
    console.log('Updating patient data...');
    try {
        const updatedData = req.body;
        await Patient.findByIdAndUpdate(req.session.user, updatedData);
        console.log('Patient data updated successfully.');
        res.redirect('/patient/profile');
    } catch (error) {
        console.error('Update patient data error:', error);
        res.status(500).send({ message: 'Error updating patient data' });
    }
});

router.post('/delete', isAuthenticatedPatient, async (req, res) => {
    console.log('Deleting patient profile...');
    try {
        const appointments = await Appointment.find({ patient: req.session.user });

        if (appointments.length > 0) {
            for (const appointment of appointments) {
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
        await Patient.findByIdAndDelete(req.session.user);
        req.session.destroy(() => {
            console.log('Patient profile deleted successfully.');
            res.redirect('/auth/login');
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user profile');
    }
});

module.exports = router;
