var database = require('../database');
var validator = require('../helpers/validator');
var security = require('../helpers/security');

module.exports = {
    create: function(params) {
        return new Promise(function(resolve, reject) {
            var errors = validator.validate(params, {
                username: validator.isString,
                password: validator.isString,
                email: validator.isEmail
            });

            if (errors.length > 0) {
                reject({
                    error: true,
                    type: 'validation',
                    rejected_parameters: errors
                })
            }

            database.query({
                text: "SELECT COUNT(*) as Count FROM Account WHERE Username = $1",
                values: [params.username]
            }).then(function (results) {
                if (results[0].Count > 0) {
                    reject({
                        error: 'Username already taken!'
                    })
                }

                var secure_password = security.hashPassword(params.password);

                return database.query({
                    text: 'INSERT INTO Account(Username, Password, Salt, Email) VALUES ($1, $2, $3, $4)',
                    values: [params.username, secure_password.hash, secure_password.salt, params.email]
                });
            }, function () {
                console.log(error);
                reject({
                    error: 'Error checking username, please try again later!'
                })
            }).then(function() {
                resolve({
                    user: params.username,
                    email: params.email
                })
            }, function() {
                reject({
                    error: 'An unexpected error has occurred! Please try again later.'
                })
            })
        });
    },
    
    authenticate: function(params, callback) {
        
    }
};