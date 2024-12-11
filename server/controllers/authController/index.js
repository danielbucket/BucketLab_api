const register = async (req, res) => {
  try { 
    res.json({ message: 'Register success' })
  }
  catch (error) {
    console.log(error)
  }

  return await res.status(200).json({ message: 'Register success' })
}

const login = async (req, res) => {
  
  try {
    res.status(200).json({ message: 'Login success'})
  }
  catch (error) {
    console.log(error)
  }
}

module.exports = {
  register,
  login
}