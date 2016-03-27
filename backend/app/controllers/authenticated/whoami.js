var express = require('express');
var router = express.Router();

router.get('/', function(request, response) {
    response.json({
        auth: request.session.user.username
    })
});

module.exports = router;