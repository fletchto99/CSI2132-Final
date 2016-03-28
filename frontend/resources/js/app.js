'use strict';

var app = (function(window, document, E, ajax) {
    var app = {};

    var moduleContainer = null;
    var moduleDefault = 'welcome';
    var currentModule = null;
    var lastModule = null;
    var navbarContainer = null;

    app.start = function() {

        document.body.removeChild(document.getElementById('NoJSMessage'));

        navbarContainer = E('div', {
            className: 'navbar-container',
            parent: document.body
        });

        moduleContainer = E('div', {
            className: 'module-container',
            parent: document.body
        });

        var buildNavbar = function navbar(container) {
            var navbar = E('nav', {
                className: 'navbar navbar-inverse',
                parent: container
            });

            var header = E('div', {
                className: 'navbar-header',
                children: [E('div', {
                    className: 'navbar-brand',
                    textContent: 'Movie DB'
                })],
                parent: navbar
            });

            var collapse = E('div', {
                className: 'collapse navbar-collapse',
                parent: navbar
            });

            var nav = E('ul', {
                className: 'nav navbar-nav',
                parent: collapse
            });

            E('li', {
                className: 'active',
                children: [E('a', {
                    href: '#portal',
                    textContent: 'Portal'
                })],
                parent: nav
            });

            var controls = E('ul', {
                className: 'nav navbar-nav navbar-right',
                parent: collapse
            });

            E('li', {
                children: [E('button',  {
                    className: 'btn btn-default',
                    textContent: 'Logout',
                    style: {
                        marginTop: '15px',
                        marginRight: '15px'
                    },
                    onclick: function() {
                        ajax.post('logout').then(function() {
                            delete app.user;
                            app.load('welcome');
                        });
                    }
                })],
                parent: controls
            });
        };

        buildNavbar(navbarContainer);

        // Handle hash changes
        var hashchange = function() {
            var id = window.location.hash.slice(1);
            app.load(id);
        };

        window.addEventListener('hashchange', hashchange, false);

        // Handle ajax errors
        ajax.onerror = function(xhr, response, reject) {
            if (xhr.status === 401) {
                delete app.user;
                app.load('welcome');
                new Alert({
                    message: 'Your session has expired',
                    type: 'info'
                }).open();
            } else if (xhr.status !== 400) {
                new Alert({
                    message: xhr.status + ' Error!',
                    type: 'danger'
                }).open();
                reject(response)
            } else {
                reject(response);
            }
        };

        // Authenticate the user, otherwise redirect to login module
        ajax.post('login').then(function(user) {
            app.user = user;
            app.load('portal')
        }, function() {
            app.load('welcome');
        });
    };

    app.load = function(id) {
        if (!id) id = moduleDefault;

        var load = function() {
            lastModule = currentModule;
            currentModule = {
                id: id,
                obj: null,
                css: []
            };

            if (lastModule) {
                // Cleanup last module
                moduleContainer.innerHTML = '';
                lastModule.css.forEach(function(css) {
                    document.head.removeChild(css);
                });

                history.pushState(null, null, '#' + id);
            } else {
                history.replaceState(null, null, '#' + id);
            }

            var script = E('script', {
                src: 'resources/js/modules/' + id + '.js',
                type: 'text/javascript',
                parent: document.head,
                onload: function() {
                    document.head.removeChild(this);
                    this.onload = false;
                },
                onerror: function() {
                    E('h1', {
                        textContent: 'Page not found!',
                        parent: moduleContainer
                    });

                    moduleContainer.animate([
                        {opacity: 0},
                        {opacity: 1}
                    ], 150);

                    document.head.removeChild(this);
                    this.onerror = false;
                }
            });
        };

        if (currentModule) {
            moduleContainer.animate([
                {opacity: 1},
                {opacity: 0}
            ], 150).onfinish = function() {
                load();
            };
        } else {
            load();
        }
    };

    app.reload = function() {
        app.load(currentModule.id);
    };

    app.module = function(register) {
        var module = register(E, ajax);

        var display = function() {
            module.display(moduleContainer);
            var anim;
            if (module.navbarVisible && navbarContainer.style.opacity == 0) {
                anim = navbarContainer.animate([
                    {opacity: 0},
                    {opacity: 1}
                ], 150);
                anim.onfinish = function () {
                    navbarContainer.style.opacity = 1;
                }
            } else if(navbarContainer.style.opacity == 1) {
                anim = navbarContainer.animate([
                    {opacity: 1},
                    {opacity: 0}
                ], 150);
                anim.onfinish = function () {
                    navbarContainer.style.opacity = 0;
                }
            }

            moduleContainer.animate([
                {opacity: 0},
                {opacity: 1}
            ], 250);
        };

        if (typeof(module.preconditions) == 'function' && !module.preconditions()) {
            var error = new Modal({
                title: "Insufficient Permissions!",
                onclose: function() {
                    app.load(lastModule.id);
                }
            });

            E('div', {
                children: [
                    E('p', {
                        textContent: 'You are not permitted to view this page!'
                    }),
                    E('button', {
                        textContent: 'Go Back',
                        className: 'btn btn-primary center',
                        onclick: function () {
                            error.close();
                            app.load(lastModule.id);
                        }
                    })
                ],
                parent: error.body
            });

            error.open();
        } else {
            if (module.css) {
                var numLeft = module.css.length;
                var cssLoaded = function(css, success) {
                    if (success) {
                        currentModule.css.push(css);
                    } else {
                        document.head.removeChild(css);
                    }

                    if (--numLeft === 0) {
                        display();
                    }
                };

                module.css.forEach(function(href) {
                    var css = E('link', {
                        href: href,
                        rel: 'stylesheet',
                        type: 'text/css',
                        parent: document.head,
                        onload: function() {
                            cssLoaded(this, true);
                            this.onload = null;
                        },
                        onerror: function() {
                            cssLoaded(this, false);
                            this.onerror = null;
                        }
                    });
                });
            } else {
                display();
            }
        }

        currentModule.obj = module;
    };

    return app;
})(window, document, E, ajax);