const cors = require('cors')
const express = require('express')
const cookieParser = require('cookie-parser')
const { userRouter } = require('./Routes/userRouter.js')
const ConnectDB = require('./ConnectDB/ConnectDB.js')
const { CorsOptions } = require('./CorsOptions/CorsOptions.js')
const blogRouter = require('./Routes/blogRouter.js')
const bodyParser = require('body-parser')


const app = express()
app.use(express.static('Public'))
app.use(cors(CorsOptions))
ConnectDB()

app.use(cookieParser())
app.use(express.json())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/', userRouter)
app.use('/', blogRouter)

const port = 7500

app.listen(port, () => console.log(`Server running at port ${port}`))
