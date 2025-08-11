const {
  createProxyMiddleware,
  debugProxyErrorsPlugin, // subscribe to proxy errors to prevent server from crashing
  loggerPlugin, // log proxy events to a logger (ie. console)
  errorResponsePlugin, // return 5xx response on proxy error
  proxyEventsPlugin, // implements the "on:" option
  fixRequestBody, // fix request body for POST/PUT requests
} = require('http-proxy-middleware');

exports.authProxy = () => createProxyMiddleware({
  target: 'http://auth_server:4021',
  changeOrigin: true,
  // onProxyReq: fixRequestBody, // Fix request body for POST/PUT requests
  pathRewrite: {
    '^/auth': '', // Remove /auth prefix when forwarding to auth server
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request to Auth_Server from App_Server: ${req.method} ${req.originalUrl}`);
    // Modify proxy request headers or body if needed
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Received response from Auth_Server: ${proxyRes.statusCode}`);
    // Modify response headers if needed
    res.setHeader('X-Proxy-Response', 'Auth_Server');
  },
  logger: console, // Use console for logging proxy events
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error while proxying to Laboratory Server.'
    });
  },
  plugins: [debugProxyErrorsPlugin, loggerPlugin, errorResponsePlugin, proxyEventsPlugin],
});