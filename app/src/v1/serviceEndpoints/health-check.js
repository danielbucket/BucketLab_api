const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('Request received at:', req.requestTime);
  const { requestTime } = req;
  const receivedAt = new Date().toISOString();
  const responseTime = new Date(receivedAt).getTime() - new Date(requestTime).getTime();

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    responseTime
  });
});

module.exports = router;