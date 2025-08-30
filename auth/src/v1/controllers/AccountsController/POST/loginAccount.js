const Account = require('../../../models/account.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    const account = await Account.findOne({ email: req.body.email });
    if (!account) {
      console.warn('Account Not Found:', req.body.email);
      return res.status(404).json({
        status: 'fail',
        fail_type: 'not_found',
        message: 'No account found with that email.'
      });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, account.password);
    if (!passwordMatch) {
      return res.status(401).json({
        status: 'fail',
        fail_type: 'invalid_password',
        message: 'Invalid password.'
      });
    }

    account.logged_in = true;
    account.logged_in_at = new Date().toISOString();
    account.login_count = (account.login_count || 0) + 1;

    await account.save();

    const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-change-in-production';
    const token = jwt.sign(
      {
        id: account._id,
        email: account.email,
        permissions: account.permissions
      },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30m' }
    );

    return res.status(200).json({
      status: 'success',
      message: 'Login successful.',
      accountData: {
        first_name: account.first_name,
        last_name: account.last_name,
        id: account._id,
        token: token,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Database operation failed.',
      error: error.message
    });
  }
};