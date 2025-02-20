const fs = require('fs');
const path = require('path');
const database = fs.readFileSync(path.resolve(__dirname, '../../stubs/db.json'));
const db = JSON.parse(database);

const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const Account = require('../../models/account.model');

const MONGO_URI = process.env.MONGO_URI;

exports.checkID = (req, res, next, id) => {
  const ID =  id.slice(1) * 1;
  const account = db.users.find(user => user.id === ID);

  if (!account) {
    return res.status(404).send({
      status: 'error',
      data: {
        message: 'Invalid ID'
      }
    });
  };

  res.validID = true;
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
  if (!res.validID) {
    return res.status(404).send({
      status: 'error',
      data: {
        message: 'Invalid ID'
      }
    });
  };

  const id = req.params.id.slice(1) * 1;
  const account = db.users.find(user => user.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      account
    }
  });
};

exports.updateAccount = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      account: 'Account updated'
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
    .then(result => console.log('Result: ', result))
    .catch(err => console.log('Error: ', err));

  const accounts = await Account.find({});
  console.log('All accounts: ', accounts);

  res.status(201).json({
    status: 'success',
    data: {
      account
    }
  });
};