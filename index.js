const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require('./models/User');
const config = require('./config/key');

// body-parser 옵션
app.use(bodyParser.urlencoded({extended: true})); // application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져올 수 있게함
app.use(bodyParser.json()) // application/json 이렇게 된 데이터를 분석해서 가져올 수 있게함

// 몽고DB연결 
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
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

// Register Route 생성
app.post('/register', (req, res) => {
    // 회원가입시 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어줌  
    const user = new User(req.body)
        // 정보들이 user모델에 저장됨
        user.save((err, userInfo) => {
            if(err) return res.json({ success: false, err})
            return res.status(200).json({
                success: true
        })
    })
})

