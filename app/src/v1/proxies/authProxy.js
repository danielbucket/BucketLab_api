const { createProxyMiddleware } = require('http-proxy-middleware');

const {
  debugProxyErrorsPlugin, // subscribe to proxy errors to prevent server from crashing
  loggerPlugin, // log proxy events to a logger (ie. console)
  errorResponsePlugin, // return 5xx response on proxy error
  proxyEventsPlugin, // implements the "on:" option
} = require('http-proxy-middleware');

exports.authProxy = () => {
  return createProxyMiddleware({
    target: 'http://auth_server:4021',
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to Auth_Server from App_Server: ${req.method} ${req.originalUrl}`);
      }
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).json({
        status: 'fail',
        message: 'Internal server error while proxying to Laboratory Server.'
      });
    },
    plugins: [debugProxyErrorsPlugin, loggerPlugin, errorResponsePlugin, proxyEventsPlugin],
  });
};