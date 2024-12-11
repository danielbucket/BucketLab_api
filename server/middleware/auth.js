const authToken = async (req, res, next) => {
  const { token } = req.headers

  if (!token) {
    console.log('BucketLab Server Fail: ', token)
    return res.status(401).json({ message: 'A token is required' })
  }

  if (token !== 'I-be-token') {
    const { body } = req
    console.log('BucketLab Server Success: ', body)
    return res.status(401).json({ message: 'You-aint-token' })
  }

  next()
}

module.exports = {
  authToken
}