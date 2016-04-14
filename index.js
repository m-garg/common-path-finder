"use strict"
var express = require('express'),
    bodyParser = require('body-parser')
    
const app = express();
app.use(bodyParser.json())
app.use(express.static(__dirname))

const server = app.listen(8100, function () {
    console.log('Server running', server.address().port)
})