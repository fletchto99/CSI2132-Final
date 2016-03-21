/**
 *  Author(s)           :  Kurt Bruneau, Matt Langlois
 *  File Created        :  May 2014
 *  File Updated        :  December 2015
 *  Details             :  Functions in this file handle ajax data requests
 *
 */

$(function () {
    'use strict';

    // Create a namespace for ajax data related functions
    MovieDB.data = {};

    /**
     * A generic function for making JSON requests
     *
     * @param {String} controller The url to make a request from
     * @param {Array} data An array of parameters to pass in the request
     * @param {Array} headers An array of headers to set on the request
     * @returns {Deferred} A deferred object that triggers after a response
     */
    MovieDB.data.request = function (controller, data, headers) {
        return $.ajax({
            url: [MovieDB.ROOT_URL, controller].join(''),
            type: 'POST',
            contentType: 'application/json',
            dataType: 'text',
            data: JSON.stringify(data),
            beforeSend: function (xhr) {
                if (headers !== undefined) {
                    headers.forEach(function (header) {
                        if (header !== undefined && header.type && header.value) {
                            xhr.setRequestHeader (header.type, header.value);
                        }
                    });
                }
            }
        }).then(function (data) {
            if (!data) {
                return;
            }
            try {
                return JSON.parse(data);
            } catch (e) {
                console.log('Warning: Server did not give a JSON response');
                return data;
            }
        }, function (jqXHR) {
            try {
                return (JSON.parse(jqXHR.responseText)).error;
            } catch (e) {
                console.log('Warning: Server did not give a JSON response');
                return jqXHR.responseText;
            }
        });
    };

});