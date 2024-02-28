const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Appointment = require('../models/appoinment');
const Doctor = require('../models/doctor');
const Patient = mongoose.model('Patient');
const { formatAppointmentDate, formatDateTime } = require('../helpers/dateFormating');

const { isAuthenticatedPatient, isAuthenticatedDoctor} = require('../middleware/authenticateCheker');
router.post('/book', isAuthenticatedPatient, async (req, res) => {
    const { doctorId, appointmentTime } = req.body;
    if (!req.session.user) {
        console.log('User is not authenticated');
        return res.status(401).send('User is not authenticated');
    }

    try {
        const patient = await Patient.findById(req.session.user).exec();
        if (!patient) {
            console.log('Patient not found');
            return res.status(404).send('Patient not found');
        }

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            console.log('Doctor not found');
            return res.status(404).send('Doctor not found');
        }

        const appointmentDate = new Date(formatDateTime(appointmentTime));
        const appointmentIndex = doctor.availableAppointments.findIndex(appointment =>
            new Date(appointment).getTime() === appointmentDate.getTime()
        );

        if (appointmentIndex === -1) {
            console.log('This appointment time is not available.');
            return res.status(400).send('This appointment time is not available.');
        }

        doctor.availableAppointments.splice(appointmentIndex, 1);
        doctor.takenAppointments.push(appointmentDate);
        await doctor.save();

        const newAppointment = new Appointment({
            patient: patient._id,
            doctor: doctorId,
            appointmentDate: appointmentDate,
            status: 'Pending'
        });
        await newAppointment.save();

        patient.appointments.push(newAppointment._id);
        await patient.save();

        console.log('Appointment booked successfully');
        res.redirect('/');
    } catch (error) {
        console.error('Error booking the appointment:', error);
        res.status(500).send('Error booking the appointment');
    }
});

router.get('/book/:doctorId', isAuthenticatedPatient, async (req, res) => {
    const { doctorId } = req.params;
    try {
        console.log('Fetching doctor details...');
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            console.log('Doctor not found');
            return res.status(404).send('Doctor not found');
        }

        console.log('Doctor details fetched successfully');
        console.log('Mapping available appointments...');
        const availableAppointments = doctor.availableAppointments.map(appointment =>
            formatAppointmentDate(appointment)
        );

        console.log('Rendering appointment booking page...');
        res.render('appointmentBookingPage', { doctor, availableAppointments });
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).send('An error occurred while fetching the doctor details');
    }
});

router.get('/details/:id', isAuthenticatedPatient, async (req, res) => {
    try {
        console.log('Fetching appointment details...');
        const appointment = await Appointment.findById(req.params.id).populate('doctor').exec();
        if (!appointment) {
            console.log('Appointment not found');
            return res.status(404).send('Appointment not found');
        }
        console.log('Appointment details fetched successfully');
        console.log('Rendering appointment details page...');
        res.render('appointmentDetails', { appointment, formatAppointmentDate });
    } catch (error) {
        console.error('Error fetching appointment details:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/delete/:id', isAuthenticatedPatient, async (req, res) => {
    try {
        console.log('Fetching appointment to delete...');
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            console.log('Appointment not found');
            return res.status(404).send('Appointment not found');
        }

        console.log('Fetching doctor associated with the appointment...');
        const doctor = await Doctor.findById(appointment.doctor);
        if (!doctor) {
            console.log('Doctor not found');
            return res.status(404).send('Doctor not found');
        }

        console.log('Fetching patient associated with the appointment...');
        const patient = await Patient.findById(appointment.patient);
        if (!patient) {
            console.log('Patient not found');
            return res.status(404).send('Patient not found');
        }

        console.log('Removing appointment from patient\'s appointments...');
        const index = patient.appointments.indexOf(appointment._id);
        if (index !== -1) {
            patient.appointments.splice(index, 1);
            await patient.save();
        }

        console.log('Removing appointment from doctor\'s takenAppointments...');
        const appointmentIndex = doctor.takenAppointments.findIndex(a =>
            a.getTime() === appointment.appointmentDate.getTime()
        );
        if (appointmentIndex !== -1) {
            doctor.takenAppointments.splice(appointmentIndex, 1);
            doctor.availableAppointments.push(appointment.appointmentDate);
            await doctor.save();
        }

        console.log('Deleting appointment from the database...');
        await Appointment.findByIdAndDelete(req.params.id);

        console.log('Redirecting to homepage...');
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post("/confirm/:_id", isAuthenticatedDoctor, async (req, res) => {
    try {
        console.log('Fetching appointment to confirm...');
        const appointment = await Appointment.findById(req.params._id);
        if (!appointment) {
            console.log('Appointment not found');
            return res.status(404).send('Appointment not found');
        }
        console.log('Updating appointment status to "Confirmed"...');
        appointment.status = "Confirmed";
        await appointment.save();

        console.log('Redirecting to doctor dashboard...');
        res.redirect('/doctor/dashboard');
    } catch (error) {
        console.error('Error confirming appointment:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});


module.exports = router;

