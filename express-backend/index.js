const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const mongodbConnectionString = require('./config/mongodb')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/users')
const authMiddleware = require('./middleware/auth')


const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/auth', authRouter)
app.use("*", authMiddleware);     //   * - means that it  serves  every enpoint in this application
app.use('/users', userRouter)



mongoose.connect(mongodbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {
        console.log('connected to mongodb')
        app.listen(port, () => {
            console.log('server is listening on port:' + port)
        })

    }).catch(err => console.log(err))


















