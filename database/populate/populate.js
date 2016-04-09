var helpers = require('./helpers');
var tmdb = require('./tmdbAPI');
var config = require('./config.json');



tmdb.getMovieIDs(config.NUM_PAGES).then(function(results) {
    console.log(results.length + " movies loaded for processing!");
    return tmdb.buildMovieRelations(results);
}).then(function (mappings) {
    return tmdb.fetchMovieTopics(mappings);
}).then(function (mappings) {
    return tmdb.fetchActorData(mappings);
}).then(function (mappings) {
    console.log("Remapping IDs");
    helpers.remap(mappings);
    console.log("Building script");
    helpers.buildScript("script.sql", mappings);
}).catch(function(error) {
    console.log(error.error + error.status)
});