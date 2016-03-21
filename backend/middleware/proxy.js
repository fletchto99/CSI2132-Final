var proxyMiddleware = require('http-proxy-middleware');

module.exports = proxyMiddleware('/api', {
    target: '127.0.0.1:8080',
    changeOrigin: true,
    ws: true,
    pathRewrite: {
        '^/remove/api' : ''
    }
});