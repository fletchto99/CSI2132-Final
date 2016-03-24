var crypto = require('crypto');

module.exports = {
    hashPassword: function(password, salt) {
        return crypto.createHash('sha1').update(password + salt).digest('base64');
    }
};
