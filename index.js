const express = require('express')
const app = express()
const port = 5000


// 몽고DB연결 
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://Yeonlisa:dusghwls1!@cluster0.4oe0m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

// 서버연결 
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})

