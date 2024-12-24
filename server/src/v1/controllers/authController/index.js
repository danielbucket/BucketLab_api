const login = (req,res,next) => {

  res.status(200).send({
    message: 'You have successfully logged in'
  })

  next()
}

module.exports = {
  login
}