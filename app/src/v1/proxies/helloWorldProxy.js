const { createProxyMiddleware } = require('http-proxy-middleware');
const helloWorldURL = process.env.HELLO_WORLD_URL || 'http://localhost:4025';

exports.helloWorldProxy = () => createProxyMiddleware({
    target: helloWorldURL,
    changeOrigin: true,
    pathRewrite: {
      '^/hello-world': '',
    },
    onError: (err,req,res) => {
      res.status(500).json({
        status: 'fail',
        message: 'Internal server error while proxying to Hello World Server.'
      });
    }
});
