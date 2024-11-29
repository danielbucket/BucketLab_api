const register = (req, res) => {
  // Register logic here

  return res.status(200).json({ message: 'Register success' })
}

const login = (req, res) => {
  // Login logic here

  return res.status(200).json({ message: 'Login success' })
}

module.exports = {
  register,
  login
}