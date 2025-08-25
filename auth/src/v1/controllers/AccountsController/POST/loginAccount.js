const Account = require('../../../models/account.model');
const jwt = require('jsonwebtoken');

exports.loginAccount = async (req, res) => {
  for (let requiredParameter of ['email', 'password']) {
    if (!req.body[requiredParameter]) {
      return res.status(422).json({
        status: 'error',
        message: `Missing required parameter: ${requiredParameter}.`
      });
    }
  }

  try {
    const found = await Account.exists({ email: req.body.email });

    if (!found) {
      return res.status(404).json({
        status: 'fail',
        fail_type: 'not_found',
        message: 'No Account found with that email.'
      });
    }

    const doc = await Account.findById({ ...found })
      .where('password').equals(req.body.password);

    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        fail_type: 'invalid_password',
        message: 'Invalid password.'
      });
    }

    doc.logged_in = true;
    doc.logged_in_at = new Date().toISOString();
    doc.login_count += 1;

    const saved = await doc.save();

    if (!saved) {
      return res.status(500).json({
        status: 'error',
        message: 'Document failed to save to the database.'
      });
    }

    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-change-in-production';
    const token = jwt.sign(
      { 
        id: saved._id,
        email: saved.email,
        permissions: saved.permissions
      }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      status: 'success',
      message: 'Login successful.',
      account: {
        first_name: saved.first_name,
        permissions: saved.permissions,
        logged_in: saved.logged_in,
        login_count: saved.login_count,
        _id: saved._id,
        token: token,
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Database operation failed.',
      error: error.message
    });
  }
};