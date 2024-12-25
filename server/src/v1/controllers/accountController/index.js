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
  const { body } = req
  
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

const deleteAccount = (req,res,next) => {
  // query the database for the account by id
  // if the account is found, delete the account
  // return a 200 status code
  // if the account is not found, return a 404 status code

  res.status(200).send({
    message: `The account registered with ${body.email} has been permanently destroyed.`
  })
}

const registerNewAccount = (req,res,next) => {
  const { body } = req
  // write code to validate that all the required fields are present
  // write code to validate that the email is unique
  // write code to hash the password
  // write code to insert the new account into the database
  // write code to return the new account id and email


  res.status(200).send({
    message: `You've registered a new account with ${body.email}`,
    id: 1234, // this would be the new account id
  })

  next()
}

module.exports = {
  verifyAccountExists,
  accountLogin,
  deleteAccount,
  registerNewAccount
}