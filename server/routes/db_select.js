var express = require('express');
var router = express.Router();
var sql = require('../utilities/SQLInterface')

router.get('/', async (req, res, next) => {
    let values = unescape(req.query.values);
    let from = unescape(req.query.from);
    let where = unescape(req.query.where);
    let results = await sql.select(values,from, where)
        .catch((err) => {
            res.sendStatus(404);
        });
    console.log(results);
    res.send(results);
});

module.exports = router;