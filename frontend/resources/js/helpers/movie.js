var movie = (function() {

    var movie = {};

    movie.displayModal = function(movie, onClose) {

        ajax.post('auth/movie/my_rating', {
            movie_id: movie.movie_id
        }).then(function(rating) {
            ajax.post('auth/actor/in_movie', {
                movie_id: movie.movie_id
            }).then(function(response) {

                var actors = [];

                response.actors.forEach(function(actor) {
                   actors.push(E('li', {
                       textContent: actor.name
                   }))
                });

                var stars = [];
                var ratingDiv = E('div');
                for (var i = 0; i < 10; i++) {
                    (function(position) {
                        var current = E('i', {
                            className: 'fa rating-star ' + (rating.rating == null ? ' rating-star-avg ' : ' rating-star-mine ') + (position+1 <= (rating.rating || Math.round(movie.rating)) ? 'fa-star' : 'fa-star-o'),
                            parent: ratingDiv,
                            position: position+1,
                            onmouseover: function () {
                                stars.forEach(function(star) {
                                    if (star.position <= current.position) {
                                        star.className = "fa fa-star rating-star rating-star-mine"
                                    } else {
                                        star.className = "fa fa-star-o rating-star rating-star-mine"
                                    }
                                });
                            },
                            onmouseout: function() {
                                stars.forEach(function(star) {
                                    if (star.position <= (rating.rating || Math.round(movie.rating))) {
                                        star.className = "fa fa-star rating-star rating-star" + (rating.rating ? "-mine" : "-avg")
                                    } else {
                                        star.className = "fa fa-star-o rating-star rating-star" + (rating.rating ? "-mine" : "-avg")
                                    }
                                });
                            },
                            onclick: function() {
                                rating.rating = current.position;
                                ajax.put('auth/movie/my_rating', {
                                    movie_id: movie.movie_id,
                                    rating: rating.rating
                                }).then(function() {
                                    new Alert({
                                        message: movie.title + ' has been rated ' + rating.rating + ' stars!',
                                        type: 'success',
                                        timeout: true
                                    }).open();
                                    stars.forEach(function(star) {
                                        if (star.position <= (rating.rating || Math.round(movie.rating))) {
                                            star.className = "fa fa-star rating-star rating-star" + (rating.rating ? "-mine" : "-avg")
                                        } else {
                                            star.className = "fa fa-star-o rating-star rating-star" + (rating.rating ? "-mine" : "-avg")
                                        }
                                    });
                                }, function() {
                                    new Alert({
                                        message: 'Error rating movie!',
                                        type: 'error'
                                    }).open()
                                })
                            }
                        });
                        stars.push(current);
                    })(i);

                }

                var imgContainer = E('div', {
                    className: 'col-md-6',
                    children: [
                        E('img', {
                            className: 'img img-responsive',
                            src: tmdb.generateImagePath(movie.poster, tmdb.sizes.w342)
                        }),
                        ratingDiv
                    ]
                });

                var infoContainer = E('div', {
                    className: 'col-md-6 movie-description',
                    children: [
                        E('p', {
                            textContent: movie.description
                        }),
                        E('div', {
                            children:[
                                E('span', {
                                    textContent: 'Directors:'
                                }),
                                E('ul', {
                                    children: [
                                        E('li', {
                                            textContent: 'Director 1'
                                        }),
                                        E('li', {
                                            textContent: 'Director 2'
                                        })
                                    ]
                                }),
                                E('span', {
                                    textContent: 'Actors:'
                                }),
                                E('ul', {
                                    children: actors
                                })
                            ]
                        })
                    ]
                });

                var content = E('div', {
                    className: 'row',
                    children: [
                        imgContainer,
                        infoContainer
                    ]
                });

                new Modal({
                    title: movie.title,
                    content: content,
                    onclose: function() {
                        if (onClose) {
                            onClose();
                        }
                    }
                }).open();
            })
        }, function() {

        });
    };

    return movie;
})();