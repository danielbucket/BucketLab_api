const { createProxyMiddleware } = require('http-proxy-middleware');

exports.authProxy = () => createProxyMiddleware({
    target: 'http://auth_server:4024',
    changeOrigin: true,
    pathRewrite: {
      '^/auth': '', // Removes /auth prefix when forwarding to authentication server
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).json({
        status: 'fail',
        message: 'Internal server error while proxying to Authentication Server.'
      })
    }
});