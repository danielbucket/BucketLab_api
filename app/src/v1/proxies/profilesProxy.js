const { createProxyMiddleware } = require('http-proxy-middleware');

exports.profilesProxy = () => (req, res, next) => {
  console.log(`Profiles Proxy received request for ${req.originalUrl} at ${new Date().toISOString()}`);
  createProxyMiddleware({
    target: 'http://profiles_server:4021',
    changeOrigin: true,
    pathRewrite: { '^/profiles': '' },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying request to profiles: ${req.method} ${req.originalUrl} -> ${proxyReq.path}`);
    },
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
        message: 'Internal server error while proxying to Profiles Server.'
      });
    }
  })(req, res, next);
};