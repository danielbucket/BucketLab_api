const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const { corsConfig } = require('../optimization/corsConfig.js');

exports.authenticationProxy = () => (req, res, next) => {
  // Handle OPTIONS requests for CORS preflight
  if (req.method === 'OPTIONS') {
    return cors(corsConfig())(req, res, next);
  }
  
  createProxyMiddleware({
    target: 'http://authentication_server:4024',
    changeOrigin: true,
    pathRewrite: { '^/auth': '' },
    onProxyRes: (proxyRes, req, res) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
      proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
      proxyRes.headers['X-Auth-Server'] = 'true'; // Custom header to indicate response is from authentication server
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).json({
        status: 'fail',
        message: 'Internal server error while proxying to Authentication Server.'
      })
    }
  })(req, res, next);
};