'use strict';

window.ajax = (function () {
    var ajax = {
        onerror: null,
        ontimeout: null
    };

    function request(method, url, params) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.addEventListener('load', function() {
                var response;
                if (this.responseText) {
                    try {
                        response = JSON.parse(this.responseText);
                    } catch (e) {
                        response = this.responseText;
                    }
                }

                // Pass results back to caller
                if (this.status >= 200 && this.status < 300) {
                    resolve(response);
                } else {
                    if (ajax.onerror) {
                        ajax.onerror(this, response, reject);
                    } else {
                        reject(response)
                    }
                }
            });

            xhr.ontimeout = function () {
                if (ajax.ontimeout) {
                    ajax.ontimeout();
                } else {
                    reject({reason: 'timeout'})
                }
            };


            xhr.timeout = 5000;
            xhr.open(method, 'api/' + url);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(params));
        });
    }

    ajax.get = request.bind(null, 'GET');
    ajax.put = request.bind(null, 'PUT');
    ajax.post = request.bind(null, 'POST');
    ajax.delete = request.bind(null, 'DELETE');

    return ajax;
})();