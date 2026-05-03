const { createProxyMiddleware } = require('http-proxy-middleware');
const { HELLO_WORLD_SERVER_URL } = process.env;

exports.helloWorldProxy = () => (req, res, next) => {
  createProxyMiddleware({
    target: HELLO_WORLD_SERVER_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/hello-world': '',
    },
    onProxyRes: (proxyRes, req, res) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
      proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
      proxyRes.headers['X-Hello-World-Proxy'] = 'true'; // Custom header to indicate response is from Hello World Proxy
    },
    onError: (err,req,res) => {
      console.error('Proxy error:', err);
      res.status(500).json({
        status: 'fail',
        message: 'Internal server error while proxying to Hello World Server.'
      });
    }
  })(req, res, next);
};