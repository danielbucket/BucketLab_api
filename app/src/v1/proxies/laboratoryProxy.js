const { createProxyMiddleware } = require('http-proxy-middleware');

exports.laboratoryProxy = () => (req, res, next) => {
  createProxyMiddleware({
    target: 'http://laboratory_server:4023',
    changeOrigin: true,
    pathRewrite: { '^/laboratory': '' },
    onProxyRes: (proxyRes, req, res) => {
      // Ensure CORS headers are properly forwarded
      proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
      proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).json({
        status: 'fail',
        message: 'Internal server error while proxying to Laboratory Server.'
      });
    }
  })(req, res, next);
};