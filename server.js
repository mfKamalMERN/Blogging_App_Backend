const cors = require('cors')
const express = require('express')
const cookieParser = require('cookie-parser')
const { userRouter } = require('./Routes/userRouter.js')
const ConnectDB = require('./ConnectDB/ConnectDB.js')
const { CorsOptions } = require('./CorsOptions/CorsOptions.js')
const blogRouter = require('./Routes/blogRouter.js')
const bodyParser = require('body-parser')
const { emailRoute } = require('./Routes/emailRouter.js')


const app = express()
const port = 7500;

//db connection
ConnectDB()

//middlewares setup
app.use(cors(CorsOptions))
app.use(cookieParser())
app.use(express.json()) //for parsing body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('Public'))

//Routes
app.use('/', userRouter)
app.use('/', blogRouter)
app.use('/', emailRoute)

//start server
app.listen(port, () => console.log(`Server running at port ${port}`))
