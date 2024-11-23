const PUT_updateUser = (req,res) => {
  const userId = req.params.id
  res.send(`Update user ${userId}`)
}

module.exports = {
  PUT_updateUser,
}