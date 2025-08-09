const { createProxyMiddleware } = require('http-proxy-middleware');

exports.laboratoryProxy = () => {
  return createProxyMiddleware({
    target: 'http://laboratory_server:4420',
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to Laboratory_Server from App_Server: ${req.method} ${req.originalUrl}`);
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
