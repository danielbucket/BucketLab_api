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

const accountLogin = (req,res,next) => {
  const { body} = req
  
  // query the database with the supplied id,
  // if id matches the email id, compare the password
  // if the password matches, return the account id
  // if the password does not match, return a 401 error 
  
  res.status(200).send({
    login: true,
    id: body.id,
    email: body.email
  })
}

const DEL_account = (req,res,next) => {
  const { params } = req

  res.status(200).send({
    message: `DELETE account by id ${params.id}`
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
  verifyAccountExists,
  accountLogin,
  DEL_account,
  POST_register
}