const key = 'I-be-tokin';
const { ObjectId } = require('mongoose').Types;

exports.validateToken = (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({
      status: 'error',
      data: {
        message: 'A token is required'
      }
    });
  };

  if (token !== key) {
    return res.status(401).json({
      status: 'error',
      data: {
        message: 'You aint no token.'
      }
    });
  };

  if (token === key) next();
};

exports.checkID = (req, res, next, id) => {
  const ID = id.slice(1);

  if (!ObjectId.isValid(ID)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid ID.',
      id
    });
  };

  next();
};
