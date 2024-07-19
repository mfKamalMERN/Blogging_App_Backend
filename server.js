const cors = require('cors')
const express = require('express')
const cookieParser = require('cookie-parser')
const { testrouter } = require('./Routes/testrouter.js')

// import cors from 'cors'
// import express from 'express'
// import cookieParser from 'cookie-parser'
// import { testcontroller } from './Controllers/testcontroller.js'


const app = express()

app.use(express.json())

app.use(cors({
    // origin: ['home', 'contacts', 'Cart'],
    // methods: ['GET', 'POST'],
    // credentials: true
}))

app.use(cookieParser())

const port = 9090

app.use('/', testrouter)

app.listen(port, () => console.log(`Server running at port ${port}`))
