'use strict';

app.module(function(E, ajax) {
    return {

        navbarVisible: false,

        css: [
            'resources/css/modules/welcome.css'
        ],

        display: function(container, params) {

            var floatingBox = E('div', {
                className: 'floating-box',
                parent: container
            });

            var modal = E('div', {
                className: 'login modal-dialog',
                parent: floatingBox
            });

            E('h2', {
                className: 'login-title',
                textContent: app.name,
                parent: modal
            });

            var content = E('div', {
                className: 'login-content modal-content',
                parent: modal
            });

            var tabs = new Tabs({
                parent: content
            });

            var login = form({
                action: 'login',
                method: 'post',
                inputs: [{
                    param: 'username',
                    label: 'Username'
                }, {
                    param: 'password',
                    label: 'Password',
                    type: 'password'
                }],
                submit: {
                    label: 'Login',
                    then: function(user) {
                        app.user = user;
                        app.initNavbar();
                        modal.animate([
                            {transform: 'scale(1, 1'},
                            {transform: 'scale(0, 0)'}
                        ], 250).onfinish = function() {
                            modal.parentElement.removeChild(modal);
                            app.load('portal');
                            new Alert({
                                message: 'Welcome, ' + app.user.username,
                                timeout: true
                            }).open();
                        };
                    }
                }
            });

            tabs.add('Login', login);

            var register = form({
                action: 'register',
                method: 'put',
                inputs: [{
                    param: 'firstname',
                    label: 'First Name'
                },{
                    param: 'lastname',
                    label: 'Last Name'
                },{
                    param: 'username',
                    label: 'Username'
                }, {
                    param: 'password',
                    label: 'Password',
                    type: 'password'
                },{
                    param: 'email',
                    label: 'Email'
                }],
                submit: {
                    label: 'Register',
                    then: function(user) {
                        new Alert({
                            message: 'Account created',
                            timeout: true
                        }).open();

                        app.user = user;
                        app.initNavbar();

                        modal.animate([
                            {transform: 'scale(1, 1'},
                            {transform: 'scale(0, 0)'}
                        ], 250).onfinish = function () {
                            modal.parentElement.removeChild(modal);
                            app.load('portal');
                        };
                    }
                }
            });

            tabs.add('Register', register);

        }
    };
});