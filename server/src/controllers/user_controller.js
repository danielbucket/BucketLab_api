const GET_user = (req,res,next) => {

  res.status(200).send({
    message: 'GET user'
  })
  next()
}

const POST_register = (req,res,next) => {
  const { body } = req
  res.status(200).send({
    message: `You've registered a new account with ${body.email}`
  })

  next()
}

module.exports = {
  GET_user,
  POST_register
}