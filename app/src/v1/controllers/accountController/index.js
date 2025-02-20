const mongoose = require('mongoose');
const Account = require('../../models/account.model');

const MONGO_URI = process.env.MONGO_URI;

exports.checkID = (req, res, next, id) => {
  console.log(`Checking for ID: ${id}...`);
  next();
};

exports.getAllAccounts = async (req, res) => {
  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', () => {
    return res.status(500).json({
      status: 'error',
      data: {
        message: 'Database connection error.'
      }
    });
  });

  const found = await Account.find({});
  
  if (!found) {
    return res.status(404).json({
      status: 'fail',
      message: 'No accounts found.'
    });
  } else {
    return res.status(200).json({
      status: 'success',
      results: found.length,
      data: { found }
    });
  };
};

exports.getAccountByID = async (req, res) => {
  const id = req.params.id.slice(1);

  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', () => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error.'
    });
  });

  const account = mongoose.model('Account');
  const doc = await account.findById({ _id: id })
  
  if (!doc) {
    return res.status(404).json({
      status: 'fail',
      message: 'No account found with that ID.'
    });
  } else {
    return res.status(200).json({
      status: 'success',
      data: { doc }
    });
  };
};

exports.updateAccount = async (req, res) => {
  const id = req.params.id.slice(1);
  const { body } = req;
  
  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', () => {
    return res.status(500).json({
      status: 'error',
      data: {
        message: 'Database connection error.'
      }
    });
  });
  
  const account = mongoose.model('Account');
  const doc = await account.findById({ _id: id });

  if (!doc) {
    return res.status(404).json({
      status: 'fail',
      data: {
        message: 'No account found with that ID.'
      }
    });
  };

  Object.keys(body).forEach((key) => {
    if (doc[key]) {
      doc[key] = body[key];
    } else {
      return res.status(404).json({
        status: 'fail',
        data: {
          message: `The key: '${key}' cannot be updated.`
        }
      });
    };
  });

  doc.updated_at = Date.now();

  await doc.save();

  res.status(200).json({
    status: 'success',
    data: { doc }
  });
};

exports.accountLogin = (req,res) => {
  for (let requiredParameter of ['email', 'password']) {
    if (!req.body[requiredParameter]) {
      return res.status(422).send({
        message: `Missing required parameter: ${requiredParameter}.`
      });
    };
  };

  res.status(200).json({
    status: 'success',
    data: {
      message: 'This endpoint has not been developed yet.'
    }
  });
};

exports.accountLogout = (req, res) => {
  res.status(200).send({
    status: 'success',
    data: {
      message: 'This endpoint has not been developed yet.'
    }
  });
};

exports.deleteAccount = async (req, res) => {
  const id = req.params.id.slice(1);

  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', () => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error.'
    });
  });

  const account = mongoose.model('Account');
  const doc = await account.findById({ _id: id });

  if (!doc) {
    return res.status(404).json({
      status: 'fail',
      message: 'No account found with that ID.'
    });
  };
  
  await doc.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null
  });
};

exports.createAccount = async (req, res) => {
  const { body } = req;
  
  for (let requiredParameter of ['first_name', 'last_name', 'email', 'password']) {
    if (!body[requiredParameter]) {
      return res.status(422).send({
        status: 'error',
        data: {
          message: `Missing required parameter: ${requiredParameter}.`
        }
      });
    };
  };
  
  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', () => {
    return res.status(500).json({
      status: 'error',
      data: {
        message: 'Database connection error.'
      }
    });
  });

  const dock = await mongoose.model('Account').findOne({ email: body.email });

  if (dock) {
    return res.status(409).json({
      status: 'fail',
      data: {
        message: 'An account with this email address already exists.'
      }
    });
  };
  
  const doc = new Account({ ...body });

  await doc.save();

  res.status(201).json({
    status: 'success',
    data: { doc }
  });
};