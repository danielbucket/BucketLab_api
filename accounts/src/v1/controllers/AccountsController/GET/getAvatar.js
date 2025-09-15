const Account = require('../../../models/account.model');
const path = require('path');
const fs = require('fs');

// GET /avatar/:id
exports.getAvatar = async (req, res) => {
  try {
    // Set CORS and cache headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cache-Control', 'public, max-age=86400'); // 1 day

    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid account ID format.'
      });
    }
    const doc = await Account.findById(id);
    if (!doc || !doc.avatar_data) {
      // Serve default image if not found
      const defaultPath = path.join(__dirname, '../../../../static/default-avatar.png');
      if (fs.existsSync(defaultPath)) {
        res.set('Content-Type', 'image/png');
        return res.send(fs.readFileSync(defaultPath));
      } else {
        return res.status(404).json({
          status: 'fail',
          message: 'No avatar found for this account and no default image available.'
        });
      }
    }
    res.set('Content-Type', doc.avatar_content_type || 'image/png');
    return res.send(doc.avatar_data);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve avatar.',
      error: error.message
    });
  }
};
