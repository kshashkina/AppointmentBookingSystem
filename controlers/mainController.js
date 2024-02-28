const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 60 });
const Doctor = require('../models/doctor');

exports.getIndexPage = async (req, res) => {
    try {
        const filter = {};
        if (req.query.specialization) {
            filter.specialization = req.query.specialization;
        }

        console.log('Checking cache for doctors list...');
        const cachedDoctors = myCache.get('doctorsList');
        if (cachedDoctors) {
            console.log('Doctors list fetched from cache');
            return res.render('index', {
                role: req.session.role,
                doctorsBySpec: cachedDoctors.doctorsBySpec,
                specializations: cachedDoctors.specializations,
                currentFilter: req.query.specialization || ""
            });
        }

        console.log('Doctors list not found in cache, fetching from database...');
        const specializations = await Doctor.distinct("specialization");
        const doctorsBySpec = {};
        if (filter.specialization) {
            doctorsBySpec[filter.specialization] = await Doctor.find(filter);
        } else {
            for (const spec of specializations) {
                doctorsBySpec[spec] = await Doctor.find({ specialization: spec });
            }
        }

        console.log('Saving doctors list to cache...');
        myCache.set('doctorsList', {
            doctorsBySpec: doctorsBySpec,
            specializations: specializations
        }, 60);

        console.log('Rendering index page with fetched data...');
        res.render('index', {
            role: req.session.role,
            doctorsBySpec: doctorsBySpec,
            specializations: specializations,
            currentFilter: req.query.specialization || ""
        });
    } catch (err) {
        console.error('Error while fetching doctors list:', err);
        res.status(500).send(err);
    }
};
