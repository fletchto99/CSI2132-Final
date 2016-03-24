var database = require('../database');

module.exports = {
    create: function(params, callback) {
        var missing = [];
        if (!params.username) {
            missing.push('username');
        }
        if (!params.password) {
            missing.push('password');
        }

        if (missing.length > 0) {
            callback({
                missing_values: missing
            }, null);
            return;
        }

        database.get().query({
            text: "SELECT * FROM Account WHERE Username = $1",
            values: [params.username]
        }, function(error, result) {
            if (error) {
                callback
            } else {

            }
        })
    },
    
    validate: function(params, callback) {
        
    }
};