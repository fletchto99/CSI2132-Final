'use strict';

app.module(function(E, ajax) {
    return {

        navbarVisible: true,

        css: [
            'resources/css/modules/portal.css'
        ],

        preconditions: function() {
            return app.user !== undefined;
        },

        display: function(container, params) {

            var loading = E('i', {
                className: 'fa fa-spinner fa-spin loading-animation',
                parent: container
            });

            ajax.get('auth/movies/recommended').then(function(response) {
                container.removeChild(loading);
                if (response.movies.length < 1) {
                    E('h1', {
                        textContent: "No movies have been recommended for you!",
                        parent: container
                    });
                    return;
                } else {
                    E('h2', {
                        textContent: "Welcome, " + app.user.first_name + ". Here are your top 12 recommended movies:",
                        parent: container
                    });
                }

                var posters = [];

                response.movies.forEach(function(movie) {
                    var ratingDiv = E('div');
                    for (var i = 0; i < 10; i++) {
                        if (i+1 <= Math.round(movie.rating)) {
                            E('i', {
                                className: 'fa fa-star rating',
                                parent: ratingDiv
                            })
                        } else {
                            E('i', {
                                className: 'fa fa-star-o rating',
                                parent: ratingDiv
                            })
                        }

                    }

                    posters.push(E('div', {
                        className: 'col-xs-4 col-sm-2 col-md-2 col-lg-2 movie-poster',
                        children: [
                            E('img', {
                                className: 'img-responsive',
                                src: tmdb.generateImagePath(movie.poster, tmdb.sizes.w154),
                                onclick: function() {
                                    window.movie.displayModal(movie);
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
                    textContent: "Error looking up movies!",
                    parent: container
                });
            });

        }
    };
});