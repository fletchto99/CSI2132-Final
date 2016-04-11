'use strict';

app.module(function(E, ajax) {
    return {

        navbarVisible: true,

        css: [
            'resources/css/modules/profile.css'
        ],

        preconditions: function() {
            return app.user !== undefined;
        },

        display: function(container, params) {
        
            ajax.get('auth/profile').then(function(response) {

                response.profile.dob = response.profile.dob == null ? null : response.profile.dob.split("T")[0];

                var profileForm = E('div', {
                    className: 'col-xs-8 col-sm-4 col-lg-4',
                    children: [
                        form({
                            action: 'auth/profile',
                            method: 'put',
                            defaults: response.profile,
                            inputs: [{
                                param: 'first_name',
                                label: 'First Name'
                            },{
                                param: 'last_name',
                                label: 'Last Name'
                            },{
                                param: 'dob',
                                label: 'Birthday',
                                type: 'date'
                            }, {
                                param: 'gender',
                                label: 'Gender',
                                type: 'select',
                                options: [{
                                    text: 'Male',
                                    value: 'M'
                                }, {
                                    text: 'Female',
                                    value: 'F'
                                }, {
                                    text: 'Prefer not to say',
                                    value: '',
                                    default: true
                                }]
                            },{
                                param: 'occupation',
                                label: 'Occupation'
                            },{
                                param: 'device_used',
                                label: 'Device'
                            }],
                            submit: {
                                label: 'Save',
                                then: function(user) {
                                    app.user.first_name = user.profile.first_name;
                                    app.user.last_name = user.profile.last_name;
                                    new Alert({
                                        message: 'Settings saved!',
                                        timeout: true
                                    }).open();
                                    app.load('portal');
                                }
                            }
                        })
                    ]
                });

                E('div', {
                    className: 'profile-form',
                    children:[
                        E('div', {
                            className: 'col-xs-2 col-sm-4 col-lg-4'
                        }),
                        profileForm,
                        E('div', {
                            className: 'col-xs-2 col-sm-4 col-lg-4'
                        })
                    ],
                    parent: container
                })
            }, function () {
                E('h1', {
                    textContent: 'Error retrieving profile information!',
                    parent: container
                })
            })

        }
    };
});