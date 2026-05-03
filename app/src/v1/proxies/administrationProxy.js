const { createProxyMiddleware } = require('http-proxy-middleware');

exports.administrationProxy = () => (req, res, next) => {
  createProxyMiddleware({
    target: 'http://administration_server:4025',
    changeOrigin: true,
    pathRewrite: { '^/administration': '' },
    onProxyRes: (proxyRes, req, res) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
      proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
      proxyRes.headers['X-Admin-Server'] = 'true'; // Custom header to indicate response is from administration server
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).json({
        status: 'fail',
        message: 'Internal server error while proxying to Administration Server.'
      })
    }
  })(req, res, next);
};