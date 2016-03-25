function form(params) {
    if (!params.defaults) {
        params.defaults = {};
    }

    var form = E('div', {
        id: params.id,
        className: ['form', params.className],
        parent: params.parent
    });

    if (params.title) {
        E('h3', {
            textContent: params.title,
            parent: form
        });
    }

    var inputs = [];
    var inputMap = {};
    params.inputs.forEach(function(input, i) {
        var group = E('div', {
            className: 'form-group',
            parent: form
        });

        var value = params.defaults[input.param];

        var elem;
        switch(input.type) {
            case 'textarea':
                elem = E('textarea', {
                    textContent: value
                });
                break;
            default:
                elem = E('input', {
                    type: input.type,
                    value: value
                });
                break;
        }

        elem.className = 'form-control';
        elem.placeholder = input.label;

        elem.onblur = function() {
            group.classList.remove('has-error');
        };

        elem.onkeydown = function(e) {
            var keyCode = e.keyCode;
            if (e.keyCode == 13) {
                var next = inputs[i + 1];
                if (next) {
                    if (input.type !== 'textarea') {
                        next.elem.focus();
                    }
                } else {
                    group.classList.remove('has-error');
                    submit.click();
                }
            }
        };

        group.appendChild(elem);

        var obj = {
            param: input.param,
            group: group,
            elem: elem,
            label: input.label
        };

        inputs.push(obj);
        inputMap[input.param] = obj;
    });

    // Focus first input after DOM update
    setTimeout(function() {
        var first = inputs[0];
        if (first) first.elem.focus();
    }, 0);

    var submit = E('input', {
        id: params.submit.id,
        className: ['btn btn-primary btn-block',
            params.submit.className],
        type: 'button',
        value: params.submit.label,
        onclick: function() {
            var data = {};
            for (key in params.defaults) {
                data[key] = params.defaults[key];
            }

            inputs.forEach(function(input) {
                data[input.param] = input.elem.value;
            });

            ajax[params.method || 'post'](params.action, data)
                .then(params.submit.then, function(err) {
                    var invalid = err.invalid;
                    if (!invalid) {
                        new Alert({
                            message: 'There was an error processing your request',
                            type: 'danger',
                            timeout: true
                        }).open();

                        if (params.catch) {
                            params.catch(err);
                        }

                        return;
                    }

                    // Show an alert if there are invalid fields
                    var message;
                    if (invalid.length === 1) {
                        message = 'Invalid ' + inputMap[invalid[0]].label || invalid[0];
                    } else if (invalid.length > 1) {
                        message = 'Form contains invalid fields';
                    }

                    new Alert({
                        message: message,
                        type: 'danger',
                        timeout: true
                    }).open();

                    // Highlight and focus invalid fields
                    var focused = false;
                    invalid.forEach(function(param) {
                        var input = inputMap[param];
                        if (input) {
                            input.group.classList.add('has-error');
                            if (!focused) {
                                input.elem.focus();
                                focused = true;
                            }
                        }
                    });
                });
        },
        parent: form
    });

    return form;
}