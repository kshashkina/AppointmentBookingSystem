const express = require('express');
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Patient = mongoose.model('Patient');
const Doctor = require("../models/doctor");
const Admin = require('../models/admin');
const Appointment = require('../models/appoinment');
const { isAuthenticatedAdmin, isAuthenticatedPatient} = require('../middleware/authenticateCheker');
const router = express.Router();


router.get('/dashboard', isAuthenticatedAdmin, async (req, res) => {
    try {
        console.log('Fetching admin dashboard...');
        const admin = await Admin.findById(req.session.user);
        if (!admin) {
            console.error('Admin not found');
            return res.status(404).send('Admin not found');
        }

        const doctors = await Doctor.find();

        res.render('adminDashboard', { admin: admin, doctors: doctors });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).send({ message: 'Error fetching profile' });
    }
});

router.post('/delete', isAuthenticatedAdmin, async (req, res) => {
    try {
        console.log('Deleting admin...');
        await Admin.findByIdAndDelete(req.session.user);
        req.session.destroy(() => {
            console.log('Admin deleted, redirecting to login page...');
            res.redirect('/auth/login'); // Redirect to the login page after deletion
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user profile');
    }
});

router.get('/edit', isAuthenticatedAdmin, async (req, res) => {
    try {
        console.log('Fetching admin data for editing...');
        const admin = await Admin.findById(req.session.user);
        if (!admin) {
            console.error('Admin not found');
            return res.status(404).send('Admin not found');
        }
        res.render('adminEdit.pug', { admin });
    } catch (error) {
        console.error('Edit patient data error:', error);
        res.status(500).send({ message: 'Error fetching admin data for editing' });
    }
});

router.get('/logout', (req, res) => {
    console.log('Logging out...');
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Session destroyed, redirecting to login page...');
        res.redirect('/auth/login');
    });
});

router.post('/edit', isAuthenticatedAdmin, async (req, res) => {
    try {
        console.log('Updating admin data...');
        const updatedData = req.body;
        await Admin.findByIdAndUpdate(req.session.user, updatedData);
        console.log('Admin data updated, redirecting to dashboard...');
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Update admin data error:', error);
        res.status(500).send({ message: 'Error updating admin data' });
    }
});

router.post('/doctor/create', isAuthenticatedAdmin, async (req, res) => {
    try {
        const { firstName, lastName, password, specialization, workSchedule, roomNumber, email, availableAppointments } = req.body;
        const workScheduleArray = workSchedule.split(',').map(item => item.trim());
        const availableAppointmentsArray = availableAppointments.split(',').map(date => new Date(date.trim()));
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(password)

        const newDoctor = new Doctor({
            firstName,
            lastName,
            hashedPassword,
            specialization,
            password: hashedPassword,
            workSchedule: workScheduleArray,
            roomNumber,
            email,
            availableAppointments: availableAppointmentsArray
        });

        await newDoctor.save();
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error creating doctor:', error);
        res.status(500).send('Error creating doctor');
    }
});

router.get('/doctor/create', isAuthenticatedAdmin, (req, res) => {
    res.render('createDoctor');
});

router.post('/doctor/edit/:doctorId', isAuthenticatedAdmin, async (req, res) => {
    try {
        console.log('Editing doctor...');
        const doctorId = req.params.doctorId;
        const { firstName, lastName, specialization, workSchedule, roomNumber, contactInfo, availableAppointments } = req.body;

        const workScheduleArray = workSchedule.split(',').map(item => item.trim());
        const availableAppointmentsArray = availableAppointments.split(',').map(date => new Date(date.trim()));

        console.log('Updating doctor data...');
        await Doctor.findByIdAndUpdate(doctorId, {
            firstName,
            lastName,
            specialization,
            workSchedule: workScheduleArray,
            roomNumber,
            contactInfo,
            availableAppointments: availableAppointmentsArray
        });

        console.log('Redirecting to admin dashboard...');
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Update doctor data error:', error);
        res.status(500).send({ message: 'Error updating doctor data' });
    }
});


router.get('/doctor/edit/:doctorId', isAuthenticatedAdmin, async (req, res) => {
    try {
        console.log('Fetching doctor for editing...');
        const doctorId = req.params.doctorId;
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            console.log('Doctor not found');
            return res.status(404).send('Doctor not found');
        }
        res.render('updateDoctor', { doctor });
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).send({ message: 'Error fetching doctor data for editing' });
    }
});

router.post('/doctor/delete/:doctorId', isAuthenticatedAdmin, async (req, res) => {
    try {
        console.log('Deleting doctor...');
        const doctorId = req.params.doctorId;
        const appointments = await Appointment.find({ doctor: doctorId });
        console.log('Deleting doctors appointments...');
        await Appointment.deleteMany({ doctor: doctorId });
        const doctor = await Doctor.findByIdAndDelete(doctorId);
        if (!doctor) {
            console.log('Doctor not found');
            return res.status(404).send('Doctor not found');
        }

        for (const appointment of appointments) {
            const patient = await Patient.findById(appointment.patient);
            if (patient) {
                patient.appointments.pull(appointment._id);
                await patient.save();
            }
        }
        console.log('Doctor deleted successfully');
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).send('Error deleting doctor profile');
    }
});



module.exports = router;
