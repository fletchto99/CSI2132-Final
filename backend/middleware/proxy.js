var proxyMiddleware = require('http-proxy-middleware');
var express = require('express');
var router = express.Router();

router.use(proxyMiddleware('/api', {
    target: '127.0.0.1:8080',
    changeOrigin: true,
    ws: true,
    pathRewrite: {
        '^/remove/api' : ''
    }
}));