#!/usr/bin/env node

var express = require('express');
var config = require('./config.json');
var database = require('./database');

var app = express();

app.use(require('./middleware/proxy'));
app.use(require('./controllers'));

database.connect(config.database, null, function(error) {
    if (!error) {
        app.listen(config.port, function() {
            console.log("Movie DB has started successfully")
        });
    } else {
        console.log("Error connecting to database!");
        process.exit(1);
    }
});
