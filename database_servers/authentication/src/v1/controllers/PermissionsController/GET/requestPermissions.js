exports.requestPermission = (req, res) => {
  const { user } = req;
  const { permission } = req.body;

  try { 
    const response = fetch('http://admin_server:4031/request/permission', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user,
        permission
      })
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while requesting permissions.',
      error: error.message
    });
  }

  res.status(200).json({ status: 'success' });
};
    