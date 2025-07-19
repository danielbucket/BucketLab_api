const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const Traveler = require('../../models/traveler.model');

const MONGO_URI = process.env.MONGO_URI;

exports.createTraveler = async (req, res) => {
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

  const found = await Traveler.exists({ email: body.email });

  if (found) {
    return res.status(409).json({
      status: 'fail',
      fail_type: 'duplicate',
      message: 'An account with that email already exists.',
      data: { email: body.email }
    });
  };

  try {
    const saved = await Traveler.create({ ...body });
    return res.status(201).json({
      status: 'success',
      message: 'Traveler created successfully.',
      data: {
        email: saved.email,
        first_name: saved.first_name
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Traveler creation failed.',
      err
    });
  };
};

exports.travelerLogin = async (req, res) => {
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

  const found = await Traveler.exists({ email: req.body.email });

  if (!found) {
    return res.status(404).json({
      status: 'fail',
      fail_type: 'not_found',
      message: 'No traveler found with that email.'
    });
  };

  const doc = await Traveler.findById({ ...found })
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
      traveler: Object.assign({}, {
        first_name: saved.first_name,
        permissions: saved.permissions,
        logged_in: saved.logged_in,
        login_count: saved.login_count,
        _id: saved._id,
        token: saved._id,
      })
    });
  };
};