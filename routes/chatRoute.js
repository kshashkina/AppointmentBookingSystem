const express = require('express');
const mongoose = require("mongoose");
const Patient = mongoose.model('Patient');
const Doctor = require("../models/doctor");
const Admin = require("../models/admin");
const router = express.Router();
const { isAuthenticated } = require('../middleware/authenticateCheker');

router.get('/chat', isAuthenticated, async (req, res) => {
    const userRole = req.session.role;
    let user;

    try {
        console.log('Starting chat route...');
        if (userRole === 'patient') {
            console.log('Patient authenticated. Retrieving patient data...');
            user = await Patient.findById(req.session.user);
        } else if (userRole === 'doctor') {
            console.log('Doctor authenticated. Retrieving doctor data...');
            user = await Doctor.findById(req.session.user);
        } else if (userRole === 'admin') {
            console.log('Admin authenticated. Retrieving admin data...');
            user = await Admin.findById(req.session.user);
        }

        if (!user) {
            console.error('User not found.');
            throw new Error("User not found");
        }

        const userName = `${user.firstName} ${user.lastName}`;

        res.render('chat', { userRole, userName });
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
