const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const { corsConfig } = require('../optimization/corsConfig.js');

exports.authenticationProxy = () => (req, res, next) => {
  console.log(`Authentication Proxy received request for ${req.originalUrl} at ${new Date().toISOString()}`);
  // Handle OPTIONS requests for CORS preflight
  if (req.method === 'OPTIONS') {
    return cors(corsConfig())(req, res, next);
  }
  
  // For other requests, apply the proxy
  createProxyMiddleware({
    target: 'http://authentication_server:4024',
    changeOrigin: true,
    // pathRewrite: { '^/profiles/create': '/create-auth' },
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
        message: 'Internal server error while proxying to Authentication Server.'
      })
    }
  })(req, res, next);
};