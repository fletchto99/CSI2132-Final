var express = require('express');
var router = express.Router();

router.use('/example', require('./example'));
router.use('/auth/test', require('./authtest'));

module.exports = router;