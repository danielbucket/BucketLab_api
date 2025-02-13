const fs = require('fs');
const path = require('path');
const database = fs.readFileSync(path.resolve(__dirname, '../../stubs/db.json'));
const db = JSON.parse(database);

const accountLogin = (req,res) => {
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

const accountLogout = (req,res) => {
  res.status(200).send({
    status: 'success',
    data: {
      loggedIn: false,
      message: 'You have been logged out.'
    }
  });
};

const deleteAccount = (req,res) => {
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

    const account = db.users.find(user => user.id === id);

    if (!account) {
      return res.status(404).send({
        status: 'error',
        data: {
          message: 'Account not found.'
        }
      });
    };

    if (account.email === body.email && account.password !== body.password) {
      return res.status(401).send({
        status: 'error',
        data: {
          message: 'Incorrect password'
        }
      });
    };

    db.users = db.users.filter(user => user.id !== id);
    fs.writeFile(path.resolve(__dirname, '../../stubs/db.json'), JSON.stringify(db), (err) => {
      if (err) {
        return res.status(500).send({
          status: 'error',
          data: {
            message: 'An error occurred while attempting to delete your account.',
            err
          }
        });
      };
      
      return res.status(200).send({
        status: 'success',
        data: null
      });
    });
  };
};



const createNewAccount = (req,res) => {
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
  
  const newId = db.users[db.users.length-1].id + 1;
  const newAccount = Object.assign({id: newId}, body);
  db.users.push(newAccount);

  fs.writeFile(path.resolve(__dirname, '../../stubs/db.json'), JSON.stringify(db), (err) => {
    if (err) {
      return res.status(500).send({
        status: 'error',
        data: {
          message: 'An error occurred while attempting to create your account.',
          err
        }
      });
    };

    res.status(201).send({
      status: 'success',
      data: {
        message: `You've created a new account with ${body.email}`,
        account: newAccount
      }
    });
  });
};

module.exports = {
  accountLogin,
  accountLogout,
  deleteAccount,
  createNewAccount
};