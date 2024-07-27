const cors = require('cors')
const express = require('express')
const cookieParser = require('cookie-parser')
const { userRouter } = require('./Routes/userRouter.js')
const ConnectDB = require('./ConnectDB/ConnectDB.js')
const { CorsOptions } = require('./CorsOptions/CorsOptions.js')


const app = express()

app.use(express.json())

app.use(cors(CorsOptions))

app.use(cookieParser())

ConnectDB()

app.use('/', userRouter)

const port = 9090

app.listen(port, () => console.log(`Server running at port ${port}`))
