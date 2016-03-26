var database = require('../database');
var validator = require('../helpers/validator');
var security = require('../helpers/security');

module.exports = {
    register: function(params) {
        return new Promise(function(resolve, reject) {
            var errors = validator.validate(params, {
                username: validator.isString,
                password: validator.isString,
                email: validator.isEmail
            });

            if (errors) {
                reject({
                    error: true,
                    type: 'validation',
                    rejected_parameters: errors
                });
                return;
            }

            database.query({
                text: "SELECT COUNT(*) as count FROM Account WHERE username = $1",
                values: [params.username]
            }).then(function (results) {

                if (results[0].count > 0) {
                    reject({
                        error: 'Username already taken!'
                    });
                    return;
                }

                var secure_password = security.hashPassword(params.password);

                return database.query({
                    text: 'INSERT INTO Account(Username, Password, Email) VALUES ($1, $2, $3)',
                    values: [params.username, secure_password, params.email]
                });
            }, function () {

                reject({
                    error: 'Error checking username, please try again later!'
                });
            }).then(function() {
                resolve({
                    user: params.username,
                    email: params.email
                })
            }, function(error) {
                reject({
                    error: 'An unexpected error has occurred! Please try again later.'
                });
            });
        });
    },
    
    authenticate: function(params) {
        return new Promise(function (resolve, reject) {
            var errors = validator.validate(params, {
                username: validator.isString,
                password: validator.isString
            });

            if (errors) {
                reject({
                    error: true,
                    type: 'validation',
                    rejected_parameters: errors
                });
                return;
            }

            database.query({
                text: "SELECT Username, Password, Email FROM Account WHERE Username = $1",
                values: [params.username]
            }).then(function (results) {

                if (results.length < 1) {
                    //Never tell the user account not found! Can be used to created an index of existing accounts for easy hacking
                    reject({
                        error: 'Invalid username or password!'
                    });
                }

                if (security.verifyPassword(params.password, results[0].password)) {
                    delete results[0].password;
                    resolve(results[0]);
                } else {
                    reject({
                        error: 'Invalid username or password!'
                    });
                }
            }, function () {
                reject({
                    error: 'Error logging in, please try again later!'
                });
            });
        });
    }
};