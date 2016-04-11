var database = require('../database');
var validator = require('../helpers/validator');
var security = require('../helpers/security');
var Promise = require('promise');

module.exports = {
    register: function(params) {
        return new Promise(function(resolve, reject) {
            var errors = validator.validate(params, {
                username: validator.isString,
                password: validator.isString,
                email: validator.isEmail,
                firstname: validator.isString,
                lastname: validator.isString
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
                if (results.rows[0].count > 0) {
                    reject({
                        error: 'Username already taken!'
                    });
                    return;
                }

                return database.query({
                    text: 'INSERT INTO Profile(First_Name, Last_Name) VALUES ($1, $2) returning Profile_ID',
                    values: [params.firstname, params.lastname]
                });


            }, function (error) {
                reject({
                    dev_error: error,
                    error: 'Error generating profile, please try again later!'
                });
            }).then(function(results) {

                var secure_password = security.hashPassword(params.password);

                return database.query({
                    text: 'INSERT INTO Account(Username, Password, Email, Profile_ID) VALUES ($1, $2, $3, $4)',
                    values: [params.username, secure_password, params.email, results.rows[0].profile_id]
                });
            }, function () {
                reject({
                    error: 'Error generating account!'
                });
            }).then(function() {
                resolve({
                    username: params.username,
                    email: params.email
                })
            }, function(error) {
                reject({
                    error: 'An unexpected error has occurred! Please try again later.',
                    dev_error: error
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
                text:
                "SELECT A.Username, A.Password, A.Email, P.Profile_ID " +
                "FROM Account A " +
                    "INNER JOIN Profile P ON P.Profile_ID = A.Profile_ID " +
                "WHERE A.Username = $1",
                values: [params.username]
            }).then(function (results) {

                if (results.rows.length < 1) {
                    //Never tell the user account not found! Can be used to created an index of existing accounts for easy hacking
                    reject({
                        error: 'Invalid username or password!'
                    });
                }

                if (security.verifyPassword(params.password, results.rows[0].password)) {
                    delete results.rows[0].password;
                    resolve(results.rows[0]);
                } else {
                    reject({
                        error: 'Invalid username or password!'
                    });
                }
            }, function (error) {
                console.log(error);
                reject({
                    error: 'Error logging in, please try again later!',
                    dev_error: error
                });
            });
        });
    }
};