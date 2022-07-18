const express = require('express');
const bodyParser = require('body-parser');
const route = require('./router/route.js')
const app = express()
const multer = require('multer');
const mongoose = require('mongoose')
// to make body data into json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(multer().any());


// Connecting mongoose
mongoose.connect("mongodb+srv://Shubh9638464483:bI1LiqgUI6ov0Jhb@cluster0.azzwg.mongodb.net/netflix?retryWrites=true&w=majority", {
        useNewUrlParser: true
    })
    .then(() => console.log("Mongodb is connected"))
    .catch(err => console.log(err))

app.use('/', route)
app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
})