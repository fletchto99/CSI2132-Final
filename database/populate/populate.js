var helpers = require('./helpers');
var tmdb = require('./tmdbAPI');
var config = require('./config.json');


var finalizeData = function (mappings) {
    console.log("Building script");
    helpers.buildScript("script.sql", mappings);
};

var handleError = function(error) {
    console.log(error.error + error.status)
};

tmdb.getMovieIDs(config.NUM_PAGES)
    .then(tmdb.buildMovieRelations)
    .then(tmdb.fetchMovieTopics)
    .then(tmdb.fetchActorData)
    .then(helpers.remap)
    .then(helpers.buildProfiles)
    .then(finalizeData)
    .catch(handleError);

