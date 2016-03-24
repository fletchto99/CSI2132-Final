var express = require('express');
var router = express.Router();

router.get('/', function (request) {
    request.session.destroy();
});

exports = router;