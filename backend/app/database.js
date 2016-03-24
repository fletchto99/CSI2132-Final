var postgres = require('pg');

var state = {
    connection: null
};

module.exports.connect = function(connection, schema, done) {
    var database = new postgres.Client(connection);
    database.connect(function(error) {
        if (error) {
            console.log("Error connecting to database: " + error);
            done(error)
        } else {
            state.connection = database;
            if (schema) {
                state.connection.query('set search_path='+schema);
            }
            console.log("Connection to database successful!");
            done();
        }

    });


};

module.exports.get = function() {
    return state.connection;
};