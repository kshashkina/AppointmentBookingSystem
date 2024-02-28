// middleware/authenticateCheker.js

function isAuthenticatedPatient(req, res, next) {
    if (req.session && req.session.user && req.session.role === 'patient') {
        next();
    } else {
        res.redirect('/auth/login');
    }
}
function isAuthenticatedAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.role === 'admin') {
        next();
    } else {
        res.redirect('/auth/login');
    }
}

function isAuthenticatedDoctor(req, res, next) {
    if (req.session && req.session.user && req.session.role === 'doctor') {
        next();
    } else {
        res.redirect('/auth/login');
    }
}

function isAuthenticated(req, res, next){
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
}
module.exports = {
    isAuthenticatedPatient,
    isAuthenticatedAdmin,
    isAuthenticatedDoctor,
    isAuthenticated
};