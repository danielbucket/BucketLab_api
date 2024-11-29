const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const cors = require('cors')
const corsOptions = { origin: ['http://localhost:8080']}
const router = require('./routers/router')
const authRouter = require('./routers/authRouter')

app.use(cors(corsOptions))
app.use(express.json())

app.use('/api', router)
app.use('/api/auth', authRouter)

app.listen(PORT, () => {
  console.log(`BucketLab Server is running on port: ${PORT}`)
})