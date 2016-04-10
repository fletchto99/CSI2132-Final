var Promise = require('promise');
var fs = require('fs');

var lookup = function (arr, key, val) {
    for (var i = 0, len = arr.length; i < len; i++) {
        if (key in arr[i] && arr[i][key] === val) {
            return arr[i];
        }
    }
    return null;
};

var remap = function (mappings) {
    console.log("Beginning remap!");
    return new Promise(function(resolve, reject) {
        try {
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

            resolve(mappings)
        } catch (err) {
            reject({
                error: err
            })
        }
    });
};

var buildScript = function (script, mappings) {

    var content = "";

    //Movies
    content += "INSERT INTO Movie(Movie_ID, Title, Poster, Description, Release_Date, IMDB_ID) VALUES\n";
    mappings.movies.forEach(function (movie) {
        content += "(" + movie.id + ", '" + movie.title.replace(new RegExp("'", 'g'), "''") + "', '" + movie.poster + "', '" + movie.description.replace(new RegExp("'", 'g'), "''") + "', to_date('" + movie.release_date + "', 'YYYY-MM-DD'), '" + movie.imdb_id +"'),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    //Directors
    content += "INSERT INTO Director(Director_ID, Name) VALUES\n";
    mappings.directors.forEach(function (director) {
        content += "(" + director.id + ", '" + director.name.replace(new RegExp("'", 'g'), "''") + "'),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    //Directs
    content += "INSERT INTO MovieDirector(Movie_ID, Director_ID) VALUES\n";
    mappings.directs.forEach(function (director) {
        content += "(" + director.movie_id + ", " + director.director_id + "),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    //Actors
    content += "INSERT INTO Actor(Actor_ID, Name, DOB) VALUES\n";
    mappings.actors.forEach(function (actor) {
        content += "(" + actor.id + ", '" + actor.name.replace(new RegExp("'", 'g'), "''") + "', " + (actor.dob == null ? actor.dob : "to_date('" + actor.dob + "', 'YYYY-MM-DD')") +"),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    //acts in
    content += "INSERT INTO MovieActor(Movie_ID, Actor_ID, Role_Name) VALUES\n";
    mappings.acts_in.forEach(function (actor) {
        content += "(" + actor.movie_id + ", " + actor.actor_id + ", '" + actor.role_name.replace(new RegExp("'", 'g'), "''") + "'),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    //Topics
    content += "INSERT INTO Topic(Topic_ID, Name) VALUES\n";
    mappings.topics.forEach(function (topic) {
        content += "(" + topic.id + ", '" + topic.name.replace(new RegExp("'", 'g'), "''") + "'),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    //movie topics
    content += "INSERT INTO MovieTopic(Movie_ID, Topic_ID) VALUES\n";
    mappings.movie_topics.forEach(function (mt) {
        content += "(" + mt.movie_id + ", " + mt.topic_id + "),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    //Studios
    content += "INSERT INTO Studio(Studio_ID, Name) VALUES\n";
    mappings.studios.forEach(function (studio) {
        content += "(" + studio.id + ", '" + studio.name.replace(new RegExp("'", 'g'), "''") + "'),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    //movie topics
    content += "INSERT INTO MovieStudio(Movie_ID, Studio_ID) VALUES\n";
    mappings.produces.forEach(function (production) {
        content += "(" + production.movie_id + ", " + production.studio_id + "),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    //movie topics
    content += "INSERT INTO Profile(Profile_ID, First_Name, Last_Name) VALUES\n";
    mappings.profiles.forEach(function (profile) {
        content += "(" + profile.id + ", '" + profile.first_name + "', '" + profile.last_name + "'),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    //movie topics
    content += "INSERT INTO ProfileMovie(Profile_ID, Movie_ID, Rating) VALUES\n";
    mappings.ratings.forEach(function (rating) {
        content += "(" + rating.profile_id + ", " + rating.movie_id + ", " + rating.rating + "),\n"
    });
    content = content.substr(0, content.length - 2) + ";\n\n";

    fs.writeFile(script, content, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Script saved!")
    });
};


var buildProfiles = function(mappings) {

    return new Promise(function (resolve, reject) {
        var profiles = [];

        for (var i = 0; i < 100; i++) {
            profiles.push({
                id: i + 1,
                first_name: 'Dummy',
                last_name: 'user'
            });
        }

        var ratings = [];

        mappings.movies.forEach(function(movie) {
            profiles.forEach(function(profile) {
                ratings.push({
                    profile_id: profile.id,
                    movie_id: movie.id,
                    rating: Math.floor((Math.random() * 10) + 1)
                })
            });
        });

        mappings.profiles = profiles;
        mappings.ratings = ratings;
        resolve(mappings)
    });
};

module.exports = {
    lookup: lookup,
    remap: remap,
    buildScript: buildScript,
    buildProfiles: buildProfiles
};