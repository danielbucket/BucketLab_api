const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const { corsConfig } = require('../optimization/corsConfig.js');

exports.createProfileProxy = () => (req, res, next) => {
  console.log('Request received at Create Profile Proxy @', new Date().toISOString());
  // Handle OPTIONS requests for CORS preflight
  if (req.method === 'OPTIONS') {
    return cors(corsConfig())(req, res, next);
  }
  
  // For other requests, apply the proxy
  createProxyMiddleware({
    target: 'http://profiles_server:4021',
    changeOrigin: true,
    pathRewrite: {
      '^/v1/auth/profiles': '/create', // Removes /v1/auth/profiles prefix when forwarding to profiles server
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
      })
    }
  })(req, res, next);
};