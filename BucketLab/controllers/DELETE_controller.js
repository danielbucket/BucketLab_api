const DELETE_userById = (req, res) => {
  const userId = req.params.id
  res.send(`Delete user ${userId}`)
}

module.exports = {
  DELETE_userById,
}