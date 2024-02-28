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
        return res.status(401).send('User is not authenticated');
    }

    try {
        const patient = await Patient.findById(req.session.user).exec();
        if (!patient) {
            return res.status(404).send('Patient not found');
        }

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).send('Doctor not found');
        }

        const appointmentDate = new Date(formatDateTime(appointmentTime));
        console.log(appointmentTime);
        console.log(appointmentDate);
        console.log(doctor.availableAppointments);
        const appointmentIndex = doctor.availableAppointments.findIndex(appointment =>
            new Date(appointment).getTime() === appointmentDate.getTime()
        );

        if (appointmentIndex === -1) {
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

        res.redirect('/');
    } catch (error) {
        console.error('Error booking the appointment:', error);
        res.status(500).send('Error booking the appointment');
    }
});

router.get('/book/:doctorId', isAuthenticatedPatient, async (req, res) => {
    const { doctorId } = req.params;
    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).send('Doctor not found');
        }

        const availableAppointments = doctor.availableAppointments.map(appointment =>
            formatAppointmentDate(appointment)
        );

        res.render('appointmentBookingPage', { doctor, availableAppointments });
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).send('An error occurred while fetching the doctor details');
    }
});

router.get('/details/:id', isAuthenticatedPatient, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate('doctor').exec();
        if (!appointment) {
            return res.status(404).send('Appointment not found');
        }
        res.render('appointmentDetails', { appointment, formatAppointmentDate });
    } catch (error) {
        console.error('Error fetching appointment details:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/delete/:id', isAuthenticatedPatient, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).send('Appointment not found');
        }

        const doctor = await Doctor.findById(appointment.doctor);
        if (!doctor) {
            return res.status(404).send('Doctor not found');
        }

        // Remove the appointment from patient's appointments
        const patient = await Patient.findById(appointment.patient);
        if (!patient) {
            return res.status(404).send('Patient not found');
        }

        const index = patient.appointments.indexOf(appointment._id);
        if (index !== -1) {
            patient.appointments.splice(index, 1);
            await patient.save();
        }

        // Remove the appointment from doctor's takenAppointments
        const appointmentIndex = doctor.takenAppointments.findIndex(a =>
            a.getTime() === appointment.appointmentDate.getTime()
        );
        if (appointmentIndex !== -1) {
            doctor.takenAppointments.splice(appointmentIndex, 1);
            doctor.availableAppointments.push(appointment.appointmentDate);
            await doctor.save();
        }

        // Delete the appointment from the database
        await Appointment.findByIdAndDelete(req.params.id);

        res.redirect('/');
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post("/confirm/:_id", isAuthenticatedDoctor, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params._id);
        if (!appointment) {
            return res.status(404).send('Appointment not found');
        }
        appointment.status = "Confirmed";
        await appointment.save();

        res.redirect('/doctor/dashboard');
    } catch (error) {
        console.error('Error confirming appointment:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});


module.exports = router;

