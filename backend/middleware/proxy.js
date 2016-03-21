var proxyMiddleware = require('http-proxy-middleware');

module.exports = proxyMiddleware('/api', {
    target: 'http://localhost:8080',
    changeOrigin: true,
    ws: true,
    pathRewrite: {
        '^/remove/api' : ''
    }
});