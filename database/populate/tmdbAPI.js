var config = require('./config.json');

var request = require("simple-rate-limiter")(require('request')).to(config.RATE_LIMIT).per(10000);
var Promise = require('promise');

var helpers = require('./helpers');


var fetchMovieTopics = function (mappings) {
    return new Promise(function(resolve, reject) {
        request({
            url: 'http://api.themoviedb.org/3/genre/movie/list?api_key=' + config.API_KEY,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("Done processing genres!");
                mappings.topics = body.genres;
                resolve(mappings);
            } else {
                reject({
                    error: error,
                    status: response.statusCode
                });
            }
        });
    });
};

var fetchActorData = function (mappings) {
    var promises = [];
    mappings.actors.forEach(function(actor, index) {
        promises.push(new Promise(function (resolve, reject) {
            request({
                url: 'http://api.themoviedb.org/3/person/' + actor.id + '?api_key=' + config.API_KEY,
                json: true
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("Done processing actor: " + index + " of " + mappings.actors.length);
                    resolve({
                        actor_id: body.id,
                        dob: body.birthday || null
                    })
                } else {
                    reject({
                        error: error,
                        status: response.statusCode
                    });
                }
            });
        }))
    });
    return Promise.all(promises).then(function (results) {
        for(var i = 0; i < mappings.actors.length; i++) {
            mappings.actors[i].dob = helpers.lookup(results, "actor_id", mappings.actors[i].id).dob;
        }
        return mappings;
    });
};

var buildMovieRelations = function (movieIDs) {
    var promises = [];
    movieIDs.forEach(function (movieID, index) {
        promises.push(new Promise(function (resolve, reject) {
            request({
                url: 'http://api.themoviedb.org/3/movie/'+movieID+'?api_key='+config.API_KEY+'&append_to_response=credits',
                json: true
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("Done processing movie: " + index + " of " + movieIDs.length);
                    resolve({
                        movie_details: {
                            id: body.id,
                            title: body.original_title,
                            description: body.overview,
                            release_date: body.release_date,
                            poster: body.poster_path.substr(1),
                            imdb_id: body.imdb_id
                        },
                        topics: body.genres,
                        studios: body.production_companies,
                        actors: body.credits.cast.map(function(castmember) {
                            return {
                                id: castmember.id,
                                name: castmember.name,
                                role_name: castmember.character
                            }
                        }),
                        directors: body.credits.crew.filter(function (crewmember) {
                            return crewmember.job == "Director"
                        }).map(function (crewmember) {
                            return {
                                id: crewmember.id,
                                name: crewmember.name
                            }
                        })
                    });
                } else {
                    reject({
                        error: error,
                        status: response.statusCode
                    });
                }
            });
        }))
    });

    return Promise.all(promises).then(function (results) {
        var movies = [];
        var movie_topics = [];

        var actors = [];
        var acts_in = [];

        var directors = [];
        var directs = [];

        var studios = [];
        var produces = [];

        results.forEach(function(movie) {
            movie.actors.forEach(function(actor) {

                if (helpers.lookup(actors, "id", actor.id) == null) {
                    actors.push({
                        id: actor.id,
                        name: actor.name
                    })
                }
                acts_in.push({
                    actor_id: actor.id,
                    movie_id: movie.movie_details.id,
                    role_name: actor.role_name
                })
            });

            movie.directors.forEach(function (director) {
                if (helpers.lookup(directors, "id", director.id) == null) {
                    directors.push({
                        id: director.id,
                        name: director.name
                    })
                }
                directs.push({
                    director_id: director.id,
                    movie_id: movie.movie_details.id
                })
            });

            movie.studios.forEach(function (studio) {
                if (helpers.lookup(studios, "id", studio.id) == null) {
                    studios.push({
                        id: studio.id,
                        name: studio.name
                    })
                }
                produces.push({
                    studio_id: studio.id,
                    movie_id: movie.movie_details.id
                })
            });

            movie.topics.forEach(function(topic) {
                movie_topics.push({
                    topic_id: topic.id,
                    movie_id: movie.movie_details.id
                })
            });

            movies.push(movie.movie_details);
        });

        return {
            actors: actors,
            directors: directors,
            acts_in: acts_in,
            directs: directs,
            movies: movies,
            movie_topics: movie_topics,
            studios: studios,
            produces: produces
        }
    });
};

var getMovieIDs = function(numPages) {
    var promises = [];
    for (var i = 1; i <= numPages; i++) {
        (function(page) {
            promises.push(new Promise(function (resolve, reject) {
                request({
                    url: 'http://api.themoviedb.org/3/discover/movie?api_key='+config.API_KEY+'&sort_by=vote_average.desc&vote_count.gte='+config.LOWER_LIMIT+'&page=' + page,
                    json: true
                }, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log("Done processing page: " + page + " of " + config.NUM_PAGES);
                        resolve(body.results.map(function(movie) {
                            return movie.id;
                        }));
                    } else {
                        reject({
                            error: error,
                            status: response.statusCode
                        });
                    }
                });
            }))
        })(i);
    }
    return Promise.all(promises).then(function(results) {
        return [].concat.apply([], results);
    });
};


module.exports = {
    fetchMovieTopics: fetchMovieTopics,
    fetchActorData: fetchActorData,
    buildMovieRelations: buildMovieRelations,
    getMovieIDs: getMovieIDs
};