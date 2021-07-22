const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./models/User');
const config = require('./config/key');
const { auth } = require('./middleware/auth');

// body-parser 옵션
app.use(bodyParser.urlencoded({extended: true})); // application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져올 수 있게함
app.use(bodyParser.json()); // application/json 이렇게 된 데이터를 분석해서 가져올 수 있게함

// cookie-parser 옵션
app.use(cookieParser());

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

// Register Route 생성
app.post('/api/users/register', (req, res) => {
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

// Login Route 생성
app.post('/api/users/login', (req, res) => {
    // 요청된 이메일을 데이터베이스 안에서 있는지 찾는다
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당되는 유저가 없습니다."
            })
        }
        // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는건지 확인한다
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
                return res.json({
                    loginSuccess: false, 
                    message: "비밀번호가 틀렸습니다." 
                })
        
            // 비밀번호까지 맞다면 토큰을 생성한다.
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);
                
                // 쿠키에 토큰을 저장한다.
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})

// Auth Route 생성
app.get('/api/users/auth', auth, (req, res) => {
    // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True 라는 뜻.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false: true, // 어드민유저인지 일반유저인지, 변경가능사항, role 0 -> 일반유저, role 0이 아니면 관리자
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

// Logout Route 생성
app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
        if(err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        })
    })
})

app.get('/api/hello', (req, res) => {
    res.send("안녕하세요")
})

const port = 5000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})