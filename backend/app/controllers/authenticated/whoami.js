var express = require('express');
var router = express.Router();

router.get('/', function(request, response) {
    response.json({
        auth: 'Logged in as: ' + request.session.user
    })
});

module.exports = router;