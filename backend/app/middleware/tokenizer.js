var config = require('../../config/app.json');

module.exports = function(req, res, next) {

    if (config.csrf_ignored.indexOf(req.method) == -1 && req.headers['X-CSRF-TOKEN'] != req.session.csrf_token) {
        res.status(500).json({
            error: 'Request has been tampered with!'
        });
    } else {
        next();
    }

};