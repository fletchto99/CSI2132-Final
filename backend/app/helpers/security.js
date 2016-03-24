var crypto = require('crypto');

module.exports = {
    generateCSRF: function(secret) {
        var current_date = (new Date()).valueOf().toString();
        var random = Math.random().toString();
        return crypto.createHash('sha1').update(current_date + random + secret).digest('base64');
    }
};
