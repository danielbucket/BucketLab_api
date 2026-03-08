const { createProxyMiddleware } = require('http-proxy-middleware');

exports.authenticationProxy = () => createProxyMiddleware({
    target: 'http://authentication_server:4024',
    changeOrigin: true,
    pathRewrite: {
      '^/authentication': '', // Removes /authentication prefix when forwarding to authentication server
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).json({
        status: 'fail',
        message: 'Internal server error while proxying to Authentication Server.'
      })
    }
});