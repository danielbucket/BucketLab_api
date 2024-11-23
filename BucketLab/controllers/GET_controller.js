const GET_allUsers = (req, res) => {
  res.send('All Users')
}

const GET_userById = (req, res) => {
  const userId = req.params.id
  res.send(`User ID: ${userId}`)
}

module.exports = {
  GET_allUsers,
  GET_userById,
}