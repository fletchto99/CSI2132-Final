var express = require('express');
var router = express.Router();

router.post('/', function (request) {
    request.session.destroy();
});

module.exports = router;