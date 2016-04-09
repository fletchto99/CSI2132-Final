var config = require('../../config/app.json');

module.exports = function (req, res, next) {
    res.jsonError = function(error, status) {
        status = status || 400;
        if (!config.developer_mode) {
            delete error.dev_error;
        }
        res.status(status).json(error);
    };
    next();
};