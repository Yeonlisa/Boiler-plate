const mongoose = require('mongoose')

// 몽고DB스키마 생성
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    }, 
    email: {
        type: String,
        trim: true, // 띄어쓰기를 없애주는 역할
        unique: 1 // 중복이메일 사용방지
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { // 어드민이냐 일반유저냐
        type: Number,
        default: 0
    },
    image: String,
    token: { // 유효성관리
        type: String
    },
    tokenExp: { // 토큰유효기간
        type: Number
    }
})

// 스키마를 User라는 모델에 넣는다
const User = mongoose.model('User', userSchema)

// 다른 파일에서도 쓸 수 있게 export를 해준다
module.exports = { User }