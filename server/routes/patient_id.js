var express = require('express');
const patient = require('../utilities/patientManager');
var router = express.Router();

router.get('/', (req, res, next) => {
    let initials = req.query.initials;
    res.send(patient.id(initials));
});

router.get('/log', (req, res, next) => {
    res.send(patient.getLog());
});

router.get("/strikeout", (req, res, next) => {
    patient.strikeOut(req.query.code, req.query.unused == 1);
    res.send(patient.getLog());
});

module.exports = router;