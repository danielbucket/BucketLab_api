const { createProxyMiddleware } = require('http-proxy-middleware');

exports.profilesProxy = () => createProxyMiddleware({
  target: 'http://profiles_server:4021',
  changeOrigin: true,
  pathRewrite: {
    '^/profiles': '', // Removes /profiles prefix when forwarding to profiles server
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request to profiles: ${req.method} ${req.originalUrl} -> ${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error while proxying to Profiles Server.'
    });
  }
});