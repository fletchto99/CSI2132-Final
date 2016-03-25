var bcrypt = require('bcrypt');

module.exports = {
    hashPassword: function(password) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        return {
            salt: salt,
            hash: hash
        };
    }
};
