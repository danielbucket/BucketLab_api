const Account = require('../../../models/account.model');

exports.newAccount = async (req, res) => {
  const { body } = req;
  
  for (let requiredParameter of ['first_name', 'last_name', 'email', 'password']) {
    if (!body[requiredParameter]) {
      return res.status(422).send({
        status: 'error',
        message: `Missing required parameter: ${requiredParameter}.`
      });
    }
  }
  
  try {
    const found = await Account.exists({ email: body.email });

    if (found) {
      return res.status(409).json({
        status: 'fail',
        fail_type: 'duplicate',
        message: 'An account with that email already exists.',
        data: { email: body.email }
      });
    }

    const saved = await Account.create({ ...body });
    return res.status(201).json({
      status: 'success',
      message: 'Account created successfully.',
      data: {
        email: saved.email,
        first_name: saved.first_name
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