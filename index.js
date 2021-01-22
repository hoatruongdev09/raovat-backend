const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

var app = express();
const connect = mongoose.connect('mongodb://localhost:27017/raovat', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => { console.log('mongoDB connected') }).catch(err => { console.log(err) })


const port = process.env.PORT || 8080

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())


app.use('/api/users', require('./routes/user'))
app.use('/api/posts', require('./routes/post'))
app.use('/api/categories', require('./routes/category'))

app.listen(port, () => {
    console.log(`App running on ${port}`)
})