const express = require('express');
const bcrypt = require('bcrypt');
const Patient = require('../models/Patient');
const Doctor = require('../models/doctor');
const Admin = require('../models/admin');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        console.log('Starting registration process...');
        const { firstName, lastName, email, password, dateOfBirth, gender, address, phoneNumber, role } = req.body;

        console.log('Checking if user already exists...');
        const existingPatient = await Patient.findOne({ email });
        const existingAdmin = await Admin.findOne({ email });
        if (existingPatient || existingAdmin) {
            console.log('User with this email already exists');
            return res.status(400).send({ message: 'User with this email already exists' });
        }

        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser;

        console.log('Creating new user...');
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
            console.log('Invalid role');
            return res.status(400).send({ message: 'Invalid role' });
        }
        console.log('Saving new user to the database...');
        await newUser.save();
        console.log('Registration successful');
        res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error); // Log any errors
        res.status(500).send({ message: 'Registration failed', error: error.message });
    }
});


router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        console.log('Starting login process...');
        let user;
        if (role === 'patient') {
            console.log('Searching for patient with email:', email);
            user = await Patient.findOne({ email });
        } else if (role === 'doctor') {
            console.log('Searching for doctor with email:', email);
            user = await Doctor.findOne({ email });
        } else if (role === 'admin') {
            console.log('Searching for admin with email:', email);
            user = await Admin.findOne({ email });
        }

        if (user) {
            console.log('User found.');
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                console.log('Password matched. Setting session and cookies...');
                req.session.user = user._id;
                if (role === 'admin') {
                    console.log('Admin login successful.');
                    req.session.role = 'admin';
                    res.cookie('isAdmin', 'true');
                    res.cookie('loggedIn', 'true');
                    return res.json({ message: 'Login successful/Admin' });
                } else if (role === 'doctor') {
                    console.log('Doctor login successful.');
                    req.session.role = 'doctor';
                    res.cookie('isAdmin', 'false');
                    res.cookie('loggedIn', 'true');
                    return res.json({ message: 'Login successful/Doctor' });
                } else {
                    console.log('Patient login successful.');
                    req.session.role = 'patient';
                    res.cookie('isAdmin', 'false');
                    res.cookie('loggedIn', 'true');
                    return res.json({ message: 'Login successful' });
                }
            }
        }
        console.log('Wrong email or password.');
        res.status(401).json({ message: 'Wrong email or password' });
    } catch (error) {
        console.error('Login failed:', error);
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
