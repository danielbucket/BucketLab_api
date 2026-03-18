const BucketLab_API_Server = require('./src/v1/app.js');
const PORT = 4020;

const server = BucketLab_API_Server.listen(PORT, () => {
  console.log(`BucketLab API Server is running on port: ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});