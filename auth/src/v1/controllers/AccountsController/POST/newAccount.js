const Account = require('../../../models/account.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.newAccount = async (req, res) => {
  const { body } = req;
  
  for (let requiredParameter of ['first_name', 'last_name', 'email', 'password']) {
    if (!body[requiredParameter]) {
      return res.status(422).send({
        status: 'error',
        message: `Missing required parameter: ${requiredParameter}.`
      });
    }
  };
  
  try {
    const found = await Account.exists({ email: body.email });
    if (found) {
      return res.status(409).json({
        status: 'fail',
        message: 'Account with that email already exists.'
      });
    }

  // Password hashing is handled by the Account model's pre-save hook
  const createdAccount = await Account.create(body);

    const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-change-in-production';
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30m';
    const token = jwt.sign({
        id: createdAccount._id,
        email: createdAccount.email
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      status: 'success',
      message: 'Account created successfully.',
      accountData: {
        first_name: createdAccount.first_name,
        last_name: createdAccount.last_name,
        email: createdAccount.email,
        id: createdAccount._id,
        token: token
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Account creation failed.',
      error: err.message
    });
  }
};