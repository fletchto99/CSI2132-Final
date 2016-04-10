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
                    "SELECT M.Title, M.Release_Date, M.Description, M.Poster, " +
                        "(SELECT AVG(PM.Rating) FROM ProfileMovie PM WHERE PM.Movie_ID = M.Movie_ID) as Rating " +
                    "FROM Movie M " +
                    "WHERE M.Title " +
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