const nodemailer = require('nodemailer');
const nodemailerMailgun = require('nodemailer-mailgun-transport');
require('dotenv').config();
const Appointment = require('../models/appoinment');

async function sendReminderEmails() {
    try {
        const auth = {
            auth: {
                api_key: process.env.MAILGUN_API_KEY,
                domain: process.env.MAILGUN_DOMAIN
            }
        };
        const transporter = nodemailer.createTransport(nodemailerMailgun(auth));

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const startOfDay = new Date(tomorrow.setHours(0, 0, 0, 0));
        const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999));

        const appointments = await Appointment.find({
            appointmentDate: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        }).populate('patient doctor');

        if (Array.isArray(appointments)) {
            appointments.forEach(appointment => {
                const mailOptions = {
                    from: "Your Clinic <kkthrrn.w@gmail.com>",
                    to: appointment.patient.email,
                    subject: 'Reminder: Doctor Appointment Tomorrow',
                    html: `
                        <p>Dear ${appointment.patient.firstName},</p>
                        <p>This is a reminder of your doctor appointment scheduled for tomorrow, ${appointment.appointmentDate.toLocaleString()}.</p>
                        <p>Your doctor's name is ${appointment.doctor.firstName} ${appointment.doctor.lastName}. Room number is ${appointment.doctor.roomNumber}</p>
                        <p>Please don't forget about your visit or cancel the appointment if necessary.</p>
                        <p>Best regards,<br>Your Clinic</p>
                    `
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log('Error sending email: ', error);
                    } else {
                        console.log('Email sent: ', info.response);
                    }
                });
            });

            console.log('Reminder emails sent.');
        } else {
            console.log('Appointments not found or not an array.');
        }
    } catch (error) {
        console.error('Error sending reminder emails:', error);
    }
}

module.exports = sendReminderEmails;
