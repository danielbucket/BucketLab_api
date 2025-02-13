const key = 'I-be-tokin';

const validateToken = (req, res, next) => {
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

module.exports = {
  validateToken
};