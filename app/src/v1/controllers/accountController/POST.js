const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const Account = require('../../models/account.model');

const MONGO_URI = process.env.MONGO_URI;

exports.createAccount = async (req, res) => {
  const { body } = req;
  
  for (let requiredParameter of ['first_name', 'last_name', 'email', 'password']) {
    if (!body[requiredParameter]) {
      return res.status(422).send({
        status: 'error',
        message: `Missing required parameter: ${requiredParameter}.`
      });
    };
  };
  
  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', () => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error.'
    });
  });

  const found = await Account.exists({ email: body.email });

  if (found) {
    return res.status(409).json({
      status: 'fail',
      fail_type: 'duplicate',
      message: 'An account with that email already exists.',
      data: { email: body.email }
    });
  };

  try {
    const saved = await Account.create({ ...body });
    return res.status(201).json({
      status: 'success',
      data: saved
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Account creation failed.',
      err
    });
  };
};

exports.accountLogin = async (req, res) => {
  for (let requiredParameter of ['email', 'password']) {
    if (!req.body[requiredParameter]) {
      return res.status(422).json({
        status: 'error',
        message: `Missing required parameter: ${requiredParameter}.`
      });
    };
  };

  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', () => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error.'
    });
  });

  const found = await Account.exists({ email: req.body.email });

  if (!found) {
    return res.status(404).json({
      status: 'fail',
      fail_type: 'not_found',
      message: 'No account found with that email.'
    });
  };

  const doc = await Account.findById({ ...found })
    .where('password').equals(req.body.password);

  if (!doc) {
    return res.status(404).json({
      status: 'fail',
      fail_type: 'invalid_password',
      message: 'Invalid password.'
    });
  };

  doc.logged_in = true;
  doc.logged_in_at = Date.now();
  doc.login_count += 1;

  const saved = await doc.save();

  if (!saved) {
    return res.status(500).json({
      status: 'error',
      message: 'Document failed to save to the database.'
    });
  } else {
    return res.status(200).json({
      status: 'success',
      data: saved
    });
  };
};