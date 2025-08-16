const Account = require('../../../models/account.model');

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

    // A JWT token should be generated here and sent to the client
    // for authentication on subsequent requests.
    // This is a placeholder for the JWT token generation and sending process.
    // const token = jwt.sign({ id: doc._id }, JWT_SECRET, { expiresIn: '1h' });
    // res.status(200).json({
    //   status: 'success',
    //   message: 'Login successful.',
    //   token,
    //   data: saved
    // });
    // For now, we'll just return the saved document.
    // In a real application, you would want to return a JWT token instead
    // of the entire document for security reasons.
    // The token should be sent in the response headers or as a cookie.

    if (!saved) {
      return res.status(500).json({
        status: 'error',
        message: 'Document failed to save to the database.'
      });
    } else {
      return res.status(200).json({
        status: 'success',
        message: 'Login successful.',
        account: Object.assign({}, {
          first_name: saved.first_name,
          permissions: saved.permissions,
          logged_in: saved.logged_in,
          login_count: saved.login_count,
          _id: saved._id,
          token: saved._id,
        })
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Database operation failed.',
      error: error.message
    });
  }
};