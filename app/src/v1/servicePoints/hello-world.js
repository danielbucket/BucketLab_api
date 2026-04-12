exports.helloWorld = (req, res) => {
  res.status(200).json({
    message: 'Hello, world. You have found the BucketLab.io API Gateway.',
    version: '4.2.0',
    timestamp: new Date().toISOString()
  });
}