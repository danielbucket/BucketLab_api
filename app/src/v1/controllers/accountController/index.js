const fs = require('fs');
const path = require('path');
const database = fs.readFileSync(path.resolve(__dirname, '../../stubs/db.json'));
const db = JSON.parse(database);


const mongoose = require('mongoose');
const Account = require('../../models/account.model');

const MONGO_URI = process.env.MONGO_URI;

exports.checkID = (req, res, next, id) => {
  console.log(`Checking for ID: ${id}`);
  next();
};

exports.getAllAccounts = async (req, res) => {
  mongoose.connect(MONGO_URI);
  mongoose.connection.once('open', () => console.log('Connected to the database.'));
  const found = await Account.find({});

  res.status(200).json({
    status: 'success',
    results: found.length,
    data: {
      found
    }
  });
};

exports.getAccountByID = (req, res) => {
  const id = req.params.id.slice(1);

  mongoose.connect(MONGO_URI);

  const account = mongoose.model('Account');

  account.findById(id).then((found) => {
    if (!found) {
      return res.status(404).json({
        status: 'fail',
        message: 'No account found with that ID'
      });
    } else {
      res.status(200).json({
        status: 'success',
        data: {
          found
        }
      });
    };
  })
  .catch((err) => {
    console.log(err);
  });
};

exports.updateAccount = async (req, res) => {
  const id = req.params.id.slice(1);
  const { body } = req;
  
  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', () => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error'
    });
  });
  
  const account = mongoose.model('Account');
  const doc = await account.findById(id);

  if (!doc) {
    return res.status(404).json({
      status: 'fail',
      message: 'No account found with that ID'
    });
  };

  Object.keys(body).forEach((key) => {
    if (doc[key]) {
      doc[key] = body[key];
    } else {
      return res.status(404).json({
        status: 'fail',
        message: `The key: '${key}' cannot be updated.`
      });
    }
  });

  doc.updated_at = Date.now();

  await doc.save();
  res.status(200).json({
    status: 'success',
    data: {
      doc
    }
  });
};

exports.accountLogin = (req,res) => {
  const { body } = req;

  for (let requiredParameter of ['email', 'password']) {
    if (!body[requiredParameter]) {
      return res.status(422).send({
        message: `Missing required parameter: ${requiredParameter}`
      });
    };
  };

  const account = db.users.find(user => user.email === body.email);

  if (account.email === body.email && account.password !== body.password) {
    return res.status(401).send({
      status: 'error',
      data: {
        loggedIn: false,
        message: 'Incorrect password'
      }
    });
  };

  if (account.email === body.email && account.password === body.password) {
    return res.status(200).send({
      status: 'success',
      data: {
        loggedIn: true,
        account
      }
    });
  };
};

exports.accountLogout = (req, res) => {
  res.status(200).send({
    status: 'success',
    data: {
      loggedIn: false,
      message: 'You have been logged out.'
    }
  });
};

exports.deleteAccount = (req, res) => {
  const id = req.params.id.slice(1) * 1;
  const { body } = req;

  for (let requiredParameter of ['email', 'password']) {
    if (!body[requiredParameter]) {
      return res.status(422).send({
        status: 'error',
        data: {
          message: `The parameter '${requiredParameter}' is required to complete this action.`
        }
      });
    };
  };

  res.status(200).send({
    status: 'success',
    data: {
      message: `Account with ID ${id} has been deleted.`
    }
  });
};

exports.createAccount = async (req, res) => {
  const { body } = req;
  
  for (let requiredParameter of ['first_name', 'last_name', 'email', 'password']) {
    if (!body[requiredParameter]) {
      return res.status(422).send({
        status: 'error',
        data: {
          message: `Missing required parameter: ${requiredParameter}`
        }
      });
    };
  };
  
  mongoose.connect(MONGO_URI);
  mongoose.connection.once('open', () => console.log('Connected to the database.'));

  const account = new Account({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password: body.password,
    website: body.website,
    company: body.company,
    phone: body.phone,
    created_at: Date.now(),
    updated_at: Date.now()
  });

  account.save()

  const accounts = await Account.find({});

  res.status(201).json({
    status: 'success',
    data: {
      accounts
    }
  });
};