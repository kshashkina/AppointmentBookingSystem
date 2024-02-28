const NodeCache = require('node-cache');
const myCache = new NodeCache();
const Doctor = require('../models/doctor');

exports.getIndexPage = async (req, res) => {
    try {
        const cacheKey = 'index_page_' + (req.query.specialization || '');

        const cachedData = myCache.get(cacheKey);
        if (cachedData) {
            console.log('Fetching index page data from cache...');
            return res.render('index', cachedData);
        }

        console.log('Fetching index page data from database...');

        const filter = {};
        if (req.query.specialization) {
            filter.specialization = req.query.specialization;
        }

        const specializations = await Doctor.distinct("specialization");
        const doctorsBySpec = {};

        if (filter.specialization) {
            doctorsBySpec[filter.specialization] = await Doctor.find(filter);
        } else {
            for (const spec of specializations) {
                doctorsBySpec[spec] = await Doctor.find({ specialization: spec });
            }
            myCache.set(cacheKey, {
                role: req.session.role,
                doctorsBySpec: doctorsBySpec,
                specializations: specializations,
                currentFilter: req.query.specialization || ""
            });
        }

        res.render('index', {
            role: req.session.role,
            doctorsBySpec: doctorsBySpec,
            specializations: specializations,
            currentFilter: req.query.specialization || ""
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};
