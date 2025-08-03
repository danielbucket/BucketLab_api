const { createProxyMiddleware } = require('http-proxy-middleware');
const { LABORATORY_ROUTE } = process.env;

exports.laboratoryProxy = () => {
  return createProxyMiddleware({
    target: LABORATORY_ROUTE,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req, res) => {
        // You can modify the request here if needed
        console.log(`Proxying request to Laboratory Server: ${req.headers.host}`);
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
