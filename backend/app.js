#!/usr/bin/env node

var express = require('express');
var config = require('./config.json');
var database = require('./database');
var proxyMiddleware = require('http-proxy-middleware');

var app = express();

var context = '/api';

var options = {
    target: '127.0.0.1:8080',
    changeOrigin: true,
    ws: true,
    pathRewrite: {
        '^/remove/api' : '/api'
    }
};

app.use(proxyMiddleware(context, options));
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
