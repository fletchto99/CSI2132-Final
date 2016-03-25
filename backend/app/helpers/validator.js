module.exports = {
    validate: function (input, validation) {
        var errors = {};
        Object.keys(validation).forEach(function (key) {
            if (!(key in input)) {
                errors[key] = "Expected a value";
            } else {
                var error = validation[key](input[key]);
                if (error) {
                    errors[key] = error;
                }
            }
        });

        return errors;
    },

    isInteger: function (value) {
        if (typeof(value) === 'number' && isFinite(value) && Math.floor(value) === value) {
            return 'Expected integer';
        }
    },

    isString: function (value) {
        if (typeof(value) !== 'string') {
            return 'Expected string'
        }
    },
    
    isEmail: function (value) {
        if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.exec(value))) {
            return 'Expected email address'
        }
    }
};