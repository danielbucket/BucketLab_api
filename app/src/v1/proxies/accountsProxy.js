const {
  createProxyMiddleware,
} = require('http-proxy-middleware');

exports.accountsProxy = () => createProxyMiddleware({
  target: 'http://accounts_server:4021',
  changeOrigin: true,
  pathRewrite: {
    '^/accounts': '', // Remove /accounts prefix when forwarding to accounts server
  },
  logLevel: 'debug', // Add debug logging
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request to accounts: ${req.method} ${req.originalUrl} -> ${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error while proxying to Accounts Server.'
    });
  }
});