var limit = require("simple-rate-limiter");
var request = limit(require("request")).to(25).per(10000);
var Promise = require('promise');
var fs = require('fs');

const API_KEY = require('./config.json').API_KEY;
const NUM_PAGES = 10; //20 movies per page, so 10 will retrieve 200 movies

getMovieIDs(NUM_PAGES).then(function(results) {
    return buildMovieRelations(results)
}, function() {
    console.log("Error retrieving movies!")
}).then(function (mappings) {
    remapIDs(mappings);
    buildScript("script.sql", mappings);
}, function() {
    console.log("Error retrieving mappings!")
});


function buildScript(script, mappings) {
    var content = "";

    //Movies
    content += "INSERT INTO Movies(ID, Title, Description, Release_Date) VALUES\n";
    mappings.movies.forEach(function (movie) {
        content += "(" + movie.id + ", '" + movie.title.replace(new RegExp("'", 'g'), "\\'") + "', '" + movie.description.replace(new RegExp("'", 'g'), "\\'") + "', " + movie.release_date + "),\n"
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
    content += "INSERT INTO Actors(ID, Name) VALUES\n";
    mappings.actors.forEach(function (actor) {
        content += "(" + actor.id + ", '" + actor.name.replace(new RegExp("'", 'g'), "\\'") + "'),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    //acts in
    content += "INSERT INTO MovieActor(Movie_ID, Actor_ID) VALUES\n";
    mappings.acts_in.forEach(function (actor) {
        content += "(" + actor.movie_id + ", " + actor.actor_id + "),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    fs.writeFile(script, content, function (err) {
        if (err) return console.log(err);
        console.log("Script saved!")
    });
}

function remapIDs(mappings) {

    for(var a = 0; a < mappings.movies.length; a++) {
        mappings.movies[a].new_id = a + 1;
    }

    for(var b = 0; b < mappings.actors.length; b++) {
        mappings.actors[b].new_id = b + 1;
    }

    for (var c = 0; c < mappings.directors.length; c++) {
        mappings.directors[c].new_id = c + 1;
    }

    for (var d = 0; d < mappings.acts_in.length; d++) {
        mappings.acts_in[d].movie_id = lookup(mappings.movies, "id", mappings.acts_in[d].movie_id).new_id;
        mappings.acts_in[d].actor_id = lookup(mappings.actors, "id", mappings.acts_in[d].actor_id).new_id;
    }

    for (var e = 0; e < mappings.directs.length; e++) {
        mappings.directs[e].movie_id = lookup(mappings.movies, "id", mappings.directs[e].movie_id).new_id;
        mappings.directs[e].director_id = lookup(mappings.directors, "id", mappings.directs[e].director_id).new_id;
    }

    for (var f = 0; f < mappings.movies.length; f++) {
        mappings.movies[f].id = mappings.movies[f].new_id;
        delete mappings.movies[f].new_id;
    }

    for (var g = 0; g < mappings.directors.length; g++) {
        mappings.directors[g].id = mappings.directors[g].new_id;
        delete mappings.directors[g].new_id;
    }

    for (var h = 0; h < mappings.actors.length; h++) {
        mappings.actors[h].id = mappings.actors[h].new_id;
        delete mappings.actors[h].new_id;
    }
}

function buildMovieRelations(movieIDs) {
    var promises = [];
    movieIDs.forEach(function (movieID) {
        promises.push(new Promise(function (resolve, reject) {
            request({
                url: 'http://api.themoviedb.org/3/movie/'+movieID+'?api_key='+API_KEY+'&append_to_response=credits',
                json: true,
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve({
                        movie_details: {
                            id: body.id,
                            title: body.original_title,
                            description: body.overview,
                            release_date: body.release_date
                        },
                        actors: body.credits.cast.map(function(castmember) {
                            return {
                                id: castmember.id,
                                name: castmember.name,
                                character: castmember.character
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
                    console.log(error);
                    reject(error);
                }
            });
        }))
    });

    return Promise.all(promises).then(function (results) {
        var actors = [];
        var directors = [];
        var acts_in = [];
        var directs = [];
        var movies = [];


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
                    character: actor.character
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
            movies.push(movie.movie_details);
        });

        return {
            actors: actors,
            directors: directors,
            acts_in: acts_in,
            directs: directs,
            movies: movies
        }
    });
}

function getMovieIDs(numPages) {
    var promises = [];
    for (var i = 1; i <= numPages; i++) {
        (function(page) {
            promises.push(new Promise(function (resolve, reject) {
                request({
                    url: 'http://api.themoviedb.org/3/discover/movie?api_key='+API_KEY+'&sort_by=vote_average.desc&vote_count.gte=1000&page=' + page,
                    json: true
                }, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        resolve(body.results.map(function(movie) {
                            return movie.id;
                        }));
                    } else {
                        reject(error);
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