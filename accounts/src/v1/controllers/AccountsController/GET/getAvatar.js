const Account = require('../../../models/account.model');
const Avatar = require('../../../models/avatar.model');
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
    const account = await Account.findById(id);
    if (!account || !account.avatar_id) {
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
    console.log('find Avatar by Account ID:', account.avatar_id);
    // Get avatar from Avatar model
    const avatar = await Avatar.findById(account.avatar_id);
    if (!avatar || !avatar.avatar_data) {
      // Serve default image if avatar data not found
      const defaultPath = path.join(__dirname, '../../../../static/default-avatar.png');
      if (fs.existsSync(defaultPath)) {
        res.set('Content-Type', 'image/png');
        return res.send(fs.readFileSync(defaultPath));
      } else {
        return res.status(404).json({
          status: 'fail',
          message: 'Avatar data not found and no default image available.'
        });
      }
    }
    
    res.set('Content-Type', avatar.content_type || 'image/png');
    return res.send(avatar.avatar_data);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve avatar.',
      error: error.message
    });
  }
};
