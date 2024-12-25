const verifyAccountExists = (req,res,next) => {
  const { body } = req

  if (!body.email) {
    res.status(400).send({
      message: 'Email is required'
    })
  }

  // query database for account by email
  // return account id if found
  
  req.body = Object.assign({}, body, { id: 1234 })
  next()
}

module.exports = {
  verifyAccountExists
}