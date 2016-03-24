module.exports = {
    checkParams: function(params, expected) {
        var missing = [];
        expected.forEach(function(param) {
            if (!params[params]) {
                missing.push(param);
            }
        });
        return missing;
    }
};