const {
  createProxyMiddleware,
} = require('http-proxy-middleware');

exports.authProxy = () => createProxyMiddleware({
  target: 'http://auth_server:4021',
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '', // Remove /auth prefix when forwarding to auth server
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error while proxying to Auth Server.'
    });
  }
});