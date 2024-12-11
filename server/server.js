const express = require('express')
const app = express()
const PORT = process.env.PORT || 4020
const cors = require('cors')
const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:5173'],
}
const router = require('./routers/router')
const authRouter = require('./routers/authRouter')


app.use(cors(corsOptions))
app.use(express.json())

app.use('/api', router)
app.use('/api/auth', cors({
  methods: ['POST'],
}), authRouter)

app.listen(PORT, () => {
  console.log(`BucketLab Server is running on port: ${PORT}`)
})