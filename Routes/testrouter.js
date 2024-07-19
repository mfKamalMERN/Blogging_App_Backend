const express = require('express')
const { testc2, testcontroller } = require('../Controllers/testcontroller.js')

const testrouter = express.Router()

testrouter.get('/tc2', testc2)

testrouter.get('/', testcontroller)

exports.testrouter = testrouter

