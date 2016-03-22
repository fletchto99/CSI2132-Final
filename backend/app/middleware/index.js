var express = require('express');
var proxy = require('proxy');
var bodyParser = require('body-parser')
var router = express.Router();

router.use(proxy);
router.use(bodyParser.json());
router.use('/example', require('./example'));

module.exports = router;