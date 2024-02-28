const express = require('express');
const bcrypt = require('bcrypt');
const Patient = require('../models/Patient');
const Doctor = require('../models/doctor');
const Admin = require('../models/admin');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, dateOfBirth, gender, address, phoneNumber, role } = req.body;

        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).send({ message: 'User with this email already exists' });
        }
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).send({ message: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser;

        if (role === 'patient') {
            newUser = new Patient({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                dateOfBirth,
                gender,
                address,
                phoneNumber
            });
        } else if (role === 'admin') {
            newUser = new Admin({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                dateOfBirth,
                gender,
                address,
                phoneNumber
            });
        } else {
            return res.status(400).send({ message: 'Invalid role' });
        }
        await newUser.save();
        res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error); // Log any errors
        res.status(500).send({ message: 'Registration failed', error: error.message });
    }
});


router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        let user;
        if (role === 'patient') {
            user = await Patient.findOne({ email });
        } else if (role === 'doctor') {
            user = await Doctor.findOne({ email });
        } else if (role === 'admin') {
            user = await Admin.findOne({ email });
        }

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                req.session.user = user._id;
                if (role === 'admin'){
                    req.session.role = 'admin';
                    res.cookie('isAdmin', 'true');
                    res.cookie('loggedIn', 'true');
                    return res.json({ message: 'Login successful/Admin' });
                }
                else if (role === 'doctor'){
                    req.session.role = 'doctor';
                    res.cookie('isAdmin', 'false');
                    res.cookie('loggedIn', 'true');
                    return res.json({ message: 'Login successful/Doctor' });
                }
                else{
                    req.session.role = 'patient';
                    res.cookie('isAdmin', 'false');
                    res.cookie('loggedIn', 'true');
                    return res.json({ message: 'Login successful' });
                }
            }
        }
        res.status(401).json({ message: 'Wrong email or password' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Login failed' });
    }
});



router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

module.exports = router;
