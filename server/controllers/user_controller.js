const GET_user = (req,res) => {

  res.status(200).send({
    message: 'GET user'
  })
}

module.exports = {
  GET_user,
}