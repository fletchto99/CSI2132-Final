var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

router.use(require('./proxy'));
router.use(bodyParser.json());

module.exports = router;