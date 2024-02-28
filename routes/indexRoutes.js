const express = require('express');
const router = express.Router();
const mainController = require('../controlers/mainController');

router.get('/', mainController.getIndexPage);

module.exports = router;
