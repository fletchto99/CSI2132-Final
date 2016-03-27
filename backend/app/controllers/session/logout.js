var express = require('express');
var developer = require('../../helpers/developer')
var router = express.Router();

router.post('/', function (request, res) {
    request.session.destroy(function(error) {
        if (!error) {
            res.json({
                status: 'Success!'
            })
        } else {
            var response = {
                dev_error: error,
                status: 'Error logging out!'
            };
            developer.prepareDevResponse(response);
            res.status(500).json(response)
        }

    });
});

module.exports = router;