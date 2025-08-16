const {
  createProxyMiddleware,
} = require('http-proxy-middleware');

exports.laboratoryProxy = () => createProxyMiddleware({
    target: 'http://laboratory_server:4420',
    changeOrigin: true,
    pathRewrite: {
      '^/laboratory': '', // Remove /laboratory prefix when forwarding to laboratory server
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).json({
        status: 'fail',
        message: 'Internal server error while proxying to Laboratory Server.'
      });
    }
});