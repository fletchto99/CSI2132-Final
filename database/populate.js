var request = require("simple-rate-limiter")(require('request')).to(20).per(10000);
var Promise = require('promise');
var fs = require('fs');
var config = require('./config.json');

getMovieIDs(config.NUM_PAGES).then(function(results) {
    console.log(results.length + " movies loaded for processing!");
    return buildMovieRelations(results);
}, function(error) {
    console.log("Error retrieving movies! Status " + error.status)
}).then(function (mappings) {
    return fetchMovieTopics(mappings);
}, function (error) {
    console.log("Error retrieving Topics! Status " + error.status)
}).then(function (mappings) {
    return fetchActorData(mappings);
}, function (error) {
    console.log("Error retrieving Actor data! Status " + error.status)
}).then(function (mappings) {
    console.log("Remapping IDs");
    remapIDs(mappings);
    console.log("Building script");
    buildScript("script.sql", mappings);
}, function(error) {
    console.log("Error retrieving mappings! Status: " + error.status)
});


function buildScript(script, mappings) {

    var content = "";

    //Movies
    content += "INSERT INTO Movies(ID, Title, Poster, Description, Release_Date, IMDB_ID) VALUES\n";
    mappings.movies.forEach(function (movie) {
        content += "(" + movie.id + ", '" + movie.title.replace(new RegExp("'", 'g'), "\\'") + "', '" + movie.poster + "', '" + movie.description.replace(new RegExp("'", 'g'), "\\'") + "', " + movie.release_date + ", '" + movie.imdb_id +"'),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    //Directors
    content += "INSERT INTO Directors(ID, Name) VALUES\n";
    mappings.directors.forEach(function (director) {
        content += "(" + director.id + ", '" + director.name.replace(new RegExp("'", 'g'), "\\'") + "'),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    //Directs
    content += "INSERT INTO MovieDirector(Movie_ID, Director_ID) VALUES\n";
    mappings.directs.forEach(function (director) {
        content += "(" + director.movie_id + ", " + director.director_id + "),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    //Actors
    content += "INSERT INTO Actors(ID, Name, DOB) VALUES\n";
    mappings.actors.forEach(function (actor) {
        content += "(" + actor.id + ", '" + actor.name.replace(new RegExp("'", 'g'), "\\'") + "', " + actor.dob +"),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    //acts in
    content += "INSERT INTO MovieActor(Movie_ID, Actor_ID, Role_Name) VALUES\n";
    mappings.acts_in.forEach(function (actor) {
        content += "(" + actor.movie_id + ", " + actor.actor_id + ", '" + actor.role_name.replace(new RegExp("'", 'g'), "\\'") + "'),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    //Topics
    content += "INSERT INTO Topics(ID, Name) VALUES\n";
    mappings.topics.forEach(function (topic) {
        content += "(" + topic.id + ", '" + topic.name.replace(new RegExp("'", 'g'), "\\'") + "'),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    //movie topics
    content += "INSERT INTO MovieTopics(Movie_ID, Topic_ID) VALUES\n";
    mappings.movie_topics.forEach(function (mt) {
        content += "(" + mt.movie_id + ", " + mt.topic_id + "),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    //Studios
    content += "INSERT INTO Studio(ID, Name) VALUES\n";
    mappings.studios.forEach(function (studio) {
        content += "(" + studio.id + ", '" + studio.name.replace(new RegExp("'", 'g'), "\\'") + "'),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    //movie topics
    content += "INSERT INTO MovieStudio(Movie_ID, Studio_ID) VALUES\n";
    mappings.produces.forEach(function (production) {
        content += "(" + production.movie_id + ", " + production.studio_id + "),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    fs.writeFile(script, content, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Script saved!")
    });
}

function remapIDs(mappings) {

    /*
     * REMAP MOVIES
     */
    for(var a = 0; a < mappings.movies.length; a++) {
        mappings.movies[a].new_id = a + 1;
    }

    /*
     * REMAP ACTORS
     */
    for(var b = 0; b < mappings.actors.length; b++) {
        mappings.actors[b].new_id = b + 1;
    }

    for (var d = 0; d < mappings.acts_in.length; d++) {
        mappings.acts_in[d].movie_id = lookup(mappings.movies, "id", mappings.acts_in[d].movie_id).new_id;
        mappings.acts_in[d].actor_id = lookup(mappings.actors, "id", mappings.acts_in[d].actor_id).new_id;
    }

    /*
     * REMAP DIRECTORS
     */

    for (var c = 0; c < mappings.directors.length; c++) {
        mappings.directors[c].new_id = c + 1;
    }

    for (var e = 0; e < mappings.directs.length; e++) {
        mappings.directs[e].movie_id = lookup(mappings.movies, "id", mappings.directs[e].movie_id).new_id;
        mappings.directs[e].director_id = lookup(mappings.directors, "id", mappings.directs[e].director_id).new_id;
    }

    /*
     * REMAP TOPICS
     */
    for (var t = 0; t < mappings.topics.length; t++) {
        mappings.topics[t].new_id = t + 1;
    }


    for (var mt = 0; mt < mappings.movie_topics.length; mt++) {
        mappings.movie_topics[mt].movie_id = lookup(mappings.movies, "id", mappings.movie_topics[mt].movie_id).new_id;
        mappings.movie_topics[mt].topic_id = lookup(mappings.topics, "id", mappings.movie_topics[mt].topic_id).new_id;
    }


    /*
     * REMAP STUDIOS
     */
    for (var s = 0; s < mappings.studios.length; s++) {
        mappings.studios[s].new_id = s + 1;
    }

    for (var ms = 0; ms < mappings.produces.length; ms++) {
        mappings.produces[ms].movie_id = lookup(mappings.movies, "id", mappings.produces[ms].movie_id).new_id;
        mappings.produces[ms].studio_id = lookup(mappings.studios, "id", mappings.produces[ms].studio_id).new_id;
    }

    /*
     * REMOVE EXTRA DATA AND SET IDS
     */
    for (var f = 0; f < mappings.movies.length; f++) {
        mappings.movies[f].id = mappings.movies[f].new_id;
        delete mappings.movies[f].new_id;
    }

    for (var h = 0; h < mappings.actors.length; h++) {
        mappings.actors[h].id = mappings.actors[h].new_id;
        delete mappings.actors[h].new_id;
    }

    for (var g = 0; g < mappings.directors.length; g++) {
        mappings.directors[g].id = mappings.directors[g].new_id;
        delete mappings.directors[g].new_id;
    }

    for (var tt = 0; tt < mappings.topics.length; tt++) {
        mappings.topics[tt].id = mappings.topics[tt].new_id;
        delete mappings.topics[tt].new_id;
    }

    for (var ss = 0; ss < mappings.studios.length; ss++) {
        mappings.studios[ss].id = mappings.studios[ss].new_id;
        delete mappings.studios[ss].new_id;
    }

}

function fetchMovieTopics(mappings) {
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
}

function fetchActorData(mappings) {
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
                        dob: body.birthday
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
            mappings.actors[i].dob = lookup(results, "actor_id", mappings.actors[i].id).dob;
        }
        return mappings;
    });
}

function buildMovieRelations(movieIDs) {
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

                if (lookup(actors, "id", actor.id) == null) {
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
                if (lookup(directors, "id", director.id) == null) {
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
                if (lookup(studios, "id", studio.id) == null) {
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
}

function getMovieIDs(numPages) {
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
}

function lookup(arr, key, val) {
    for (var i = 0, len = arr.length; i < len; i++) {
        if (key in arr[i] && arr[i][key] === val) {
            return arr[i];
        }
    }
    return null;
}