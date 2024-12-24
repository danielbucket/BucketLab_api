const GET_account = (req,res,next) => {
  res.status(200).send({
    message: 'GET account'
  })

  next()
}

const GET_accountById = (req,res,next) => {
  const { params } = req

  res.status(200).send({
    message: `GET account by id ${params.id}`
  })

  next()
}

const PUT_account = (req,res,next) => {
  const { params, body} = req

  res.status(200).send({
    message: `PUT acccount by id ${params.id}`
  })

  next()
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
  GET_account,
  GET_accountById,
  PUT_account,
  DEL_account,
  POST_register
}