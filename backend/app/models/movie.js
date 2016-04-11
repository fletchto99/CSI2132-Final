var database = require('../database');
var validator = require('../helpers/validator');
var Promise = require('promise');

module.exports = {
    getMyRating: function(params) {

        return new Promise(function (resolve, reject) {

            var errors = validator.validate(params, {
                profile_id: validator.isInteger,
                movie_id: validator.isInteger
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
                "SELECT Rating " +
                "FROM ProfileMovie " +
                "WHERE Movie_ID = $1 AND Profile_ID = $2",
                values: [params.movie_id, params.profile_id]
            }).then(function(results) {
                if (results.rows.length < 1) {
                    resolve(null);
                } else {
                    resolve(results.rows[0].rating);
                }
            }, function(error) {
                reject({
                    error: "Error looking up rating",
                    dev_error: error
                })
            });
        });


    },

    updateMyRating: function(params) {

        return new Promise(function (resolve, reject) {

            var errors = validator.validate(params, {
                profile_id: validator.isInteger,
                movie_id: validator.isInteger,
                rating: validator.isInteger
            });

            if (errors) {
                reject({
                    error: true,
                    type: 'validation',
                    rejected_parameters: errors
                });
                return;
            }

            console.log("Hello");

            database.query({
                text:
                "SELECT Rating " +
                "FROM ProfileMovie " +
                "WHERE Movie_ID = $1 AND Profile_ID = $2",
                values: [params.movie_id, params.profile_id]
            }).then(function(results) {
                if (results.rows.length < 1) {
                    return database.query({
                        text:
                        "INSERT INTO ProfileMovie(Profile_ID, Movie_ID, Rating, Date) " +
                        "VALUES ($1, $2, $3, NOW())",
                        values: [params.profile_id, params.movie_id, params.rating]
                    })
                } else {
                    return database.query({
                        text:
                        "UPDATE ProfileMovie " +
                        "SET Rating=$1 " +
                        "WHERE Movie_ID = $2 AND Profile_ID = $3",
                        values: [params.rating, params.movie_id, params.profile_id]
                    })
                }
            }, function(error) {
                reject({
                    error: "Error looking up rating",
                    dev_error: error
                })
            }).then(function() {
                resolve();
            }, function() {
                reject({
                    error: "Error applying rating",
                    dev_error: error
                })
            });
        });
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
                    "SELECT M.Movie_ID, M.Title, M.Release_Date, M.Description, M.Poster, " +
                        "(SELECT AVG(PM.Rating) FROM ProfileMovie PM WHERE PM.Movie_ID = M.Movie_ID) as Rating " +
                    "FROM Movie M " +
                    "WHERE M.Title " +
                    "ILIKE $1",
                values: ["%" + params.title + "%"]
            }).then(function(results) {
                resolve(results.rows)
            }, function(error) {
                reject({
                    error: "Error looking up movie",
                    dev_error: error
                })
            });  
        });
    }
};