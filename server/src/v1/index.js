const express = require('express')
const server = express()
const cors = require('cors')
const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:5173'],
}
const routes = require('./routes/accountRoutes.js')
const authRoutes = require('./routes/authRoutes.js')

server.use(cors(corsOptions))
server.use(express.json())
server.get('/', (req, res) => { res.status(200).json({ message: 'BucketLab API'}) })
server.use('/api/v1', routes)
server.use('/api/auth/v1',
  cors({
  methods: ['POST'],
}),
authRoutes)

module.exports = server