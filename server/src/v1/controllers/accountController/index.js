const accountLogin = (req,res) => {
  const { body } = req

  for (let requiredParameter of ['email', 'password']) {
    if (!body[requiredParameter]) {
      return res.status(422).send({
        message: `Missing required parameter: ${requiredParameter}`
      })
    }
  }
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

const deleteAccount = (req,res) => {
  const { params } = req
  const { body } = req
  
  // query the database for the account by id
  // if the account is found, delete the account
  // return a 200 status code
  // if the account is not found, return a 404 status code

  res.status(200).send({
    message: `The account registered with ${body.email} has been permanently destroyed.`
  })
}

const registerNewAccount = (req,res) => {
  console.log('registerNewAccount', req.body)
  const { body } = req
  
  // write code to validate that all the required fields are present
  for (let requiredParameter of ['first_name', 'last_name', 'email', 'password']) {
      if (!body[requiredParameter]) {
        return res.status(422).send({
          message: `Missing required parameter: ${requiredParameter}`
        })
      }
    }
  
  // write code to validate that the email is unique
  // write code to hash the password
  // write code to insert the new account into the database
  // write code to return the new account id and email


  res.status(200).send({
    registerSuccess: true,
    message: `You've registered a new account with ${body.email}`,
    email: body.email,
    id: 1234 // this should be the new account id
  })
}

module.exports = {
  accountLogin,
  deleteAccount,
  registerNewAccount
}