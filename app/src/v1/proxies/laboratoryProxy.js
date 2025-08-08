const { createProxyMiddleware } = require('http-proxy-middleware');

exports.laboratoryProxy = () => {
  return createProxyMiddleware({
    target: 'http://laboratory_server:4420',
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req, res) => {
        // You can modify the request here if needed
        console.log(`Proxying request to Laboratory_Server @ ${LABORATORY_ROUTE}`);
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
