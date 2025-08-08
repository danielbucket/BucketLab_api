const { createProxyMiddleware } = require('http-proxy-middleware');
const { AUTH_ROUTE } = process.env;

exports.authProxy = () => {
  return createProxyMiddleware({
    target: AUTH_ROUTE,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to Auth Server: ${req.headers.host}`);
      }
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).json({
        status: 'fail',
        message: 'Internal server error while proxying to laboratory service.'
      });
    }
  });
};