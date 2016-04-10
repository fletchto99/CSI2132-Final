var database = require('../database');
var validator = require('../helpers/validator');
var Promise = require('promise');

module.exports = {
    fetchAll: function(params) {
        
    },
    
    fetchMovie: function (params) {
        return new Promise(function(resolve, reject) {

            var errors = validator.validate(params, {
                title: validator.isDefined
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
                    "SELECT Title, Release_Date, Description, Poster " +
                    "FROM Movie " +
                    "WHERE Title " +
                    "ILIKE $1",
                values: ["%" + params.title + "%"]
            }).then(function(results) {
                resolve(results.rows)
            }, function(error) {
                console.log(error);
                reject({
                    error: "Derp?",
                    dev_error: error
                })
            });  
        });
    }
};