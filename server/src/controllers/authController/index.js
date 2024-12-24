const register = (req, res) => {
  // try { 
  //   res.json({ message: 'Register success' })
  // }
  // catch (error) {
  //   console.log(error)
  // }

  return res.status(200).json({ message: 'Register success' })
}

const login = async (req, res) => {

  // try {
  //   await res.status(200).json({ message: 'Login success'})
  // }
  // catch (error) {
  //   console.log(error)
  // }


}

module.exports = {
  register,
  login
}