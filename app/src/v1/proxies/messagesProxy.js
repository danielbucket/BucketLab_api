const { createProxyMiddleware } = require('http-proxy-middleware');

exports.messagesProxy = () => createProxyMiddleware({
    target: 'http://messages_server:4022',
    changeOrigin: true,
    pathRewrite: {
      '^/messages': '',
    },
    onError: (err,req,res) => {
      console.error('Proxy error:', err);
      res.status(500).json({
        status: 'fail',
        message: 'Internal server error while proxying to Messages Server.'
      });
    }
});