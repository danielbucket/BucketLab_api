const homelabStatus_stub = require('./homelabStatus_stub.json');

exports.getHomelabStatus = (req, res) => {
  try {
    // In a real implementation, you would fetch the actual status of the homelab here.
    // For now, we return the stubbed data.
    res.status(200).json({
      status: 'success',
      data: homelabStatus_stub
    });
  } catch (error) {
    console.error('Error fetching homelab status:', error);
    res.status(500).json({
      status: 'fail',
      fail_type: 'server_error',
      message: 'An error occurred while fetching homelab status.'
    });
  }
};