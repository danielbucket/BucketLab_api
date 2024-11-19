const getUserById = (req, res) => {
  const userId = req.params.id
  res.send(`User ID: ${userId}`)
}

module.exports = {
  getUserById,
}