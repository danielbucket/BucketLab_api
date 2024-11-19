const GET_controller = (req, res) => {
  res.send('This is the Login_GET_controller')
}

const POST_controller = (req, res) => {
  res.send('This is the Login_POST_controller')
}

module.exports = {
  GET_controller,
  POST_controller,
}