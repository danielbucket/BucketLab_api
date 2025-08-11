const {
  createProxyMiddleware,
  loggerPlugin, // log proxy events to a logger (ie. console)
  errorResponsePlugin, // return 5xx response on proxy error
} = require('http-proxy-middleware');

exports.authProxy = () => createProxyMiddleware({
  target: 'http://auth_server:4021',
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '', // Remove /auth prefix when forwarding to auth server
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request to Auth_Server from App_Server: ${req.method} ${req.originalUrl}`);
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Received response from Auth_Server: ${proxyRes.statusCode}`);
    res.setHeader('X-Proxy-Response', 'Auth_Server');
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error while proxying to Laboratory Server.'
    });
  },
  plugins: [loggerPlugin, errorResponsePlugin],
});