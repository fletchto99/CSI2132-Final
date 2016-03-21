#!/usr/bin/env node

var express = require('express');
var config = require('./config.json');
var database = require('./database');
var httpProxy = require('http-proxy');

var app = express();
var apiProxy = httpProxy.createProxyServer();

app.use(function(req, res, next) {
    if(req.url.match(new RegExp('^\/api\/'))) {
        apiProxy.web(req, res, {
            target: {
                host: "localhost",
                port: config.port
            }
        });
        console.log("Proxying request");
    } else {
        console.log("Valid request");
        next();
    }
});

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
