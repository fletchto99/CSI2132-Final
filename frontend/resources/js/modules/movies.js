'use strict';

app.module(function(E, ajax) {
    return {

        navbarVisible: true,

        css: [
            'resources/css/modules/movies.css'
        ],

        preconditions: function() {
            return app.user !== undefined;
        },

        display: function(container, params) {

            var displayMovie = function(movie) {

                var content = E('div');



                new Modal({
                    title: movie.title,
                    content: content
                }).open();
            };

            ajax.post('auth/find_movies', {
                title: params.query
            }).then(function(response) {
                if (response.movies.length < 1) {
                    E('h1', {
                        textContent: "No movies found containing: "+ params.query +"!",
                        parent: container
                    });
                    return;
                } else {
                    E('h1', {
                        textContent: "Movies for: "+ params.query +"!",
                        parent: container
                    });
                }

                var posters = [];

                response.movies.forEach(function(movie) {

                    var ratingDiv = E('div');
                    for (var i = 0; i < 10; i++) {
                        if (i < movie.rating) {
                            E('i', {
                                className: 'fa fa-star rating-star',
                                parent: ratingDiv
                            })
                        } else {
                            E('i', {
                                className: 'fa fa-star-o rating-star',
                                parent: ratingDiv
                            })
                        }

                    }

                    posters.push(E('div', {
                        className: 'col-md-2 movie-poster',
                        children: [
                            E('img', {
                                className: 'img-responsive',
                                src: tmdb.generateImagePath(movie.poster, tmdb.sizes.w154),
                                onclick: function() {
                                    displayMovie(movie);
                                }
                            }),
                            ratingDiv
                        ],
                        parent: grid
                    }));
                });

                var grid = E('div', {
                    className: 'movie-grid',
                    children: posters,
                    parent: container
                });

            }, function(error) {
                E('h1', {
                    textContent: "Error lookin up movies!",
                    parent: container
                });
            });

        }
    };
});