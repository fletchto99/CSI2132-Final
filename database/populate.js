var limit = require("simple-rate-limiter");
var request = limit(require("request")).to(30).per(10000);

var movies = [];
var done = 0;

for (var i = 1; i < 10; i++) {
    console.log(i);

    request({
        url: 'http://api.themoviedb.org/3/discover/movie?api_key=093de119db2b1a3e776143e922ed7eed&sort_by=vote_average.desc&vote_count.gte=1000&page=' + i,
        json: true
    }, function(error, response, body) {
        done++;
        if (!error && response.statusCode == 200) {
            movies = movies.concat(body.results);
        }
        if (done == 9) {
            console.log(movies);
        }
    });

}
