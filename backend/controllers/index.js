var express = require('express');
var router = express.Router();

router.use('/example', require('./example'));

module.exports = router;