const express = require('express')
const app = express()
const cors = require('cors')
const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:5173'],
}
const router = require('./routers/router')
const authRouter = require('./routers/authRouter')

app.use(cors(corsOptions))
app.use(express.json())
app.get('/', (req, res) => { res.status(200).json({ message: 'BucketLab API'}) })
app.use('/api', router)
app.use('/api/auth', cors({
  methods: ['POST'],
}), authRouter)

module.exports = app