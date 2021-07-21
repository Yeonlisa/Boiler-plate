const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // salts가 몇자리인가(여기선 10자리)
const jwt = require('jsonwebtoken');


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

// user모델에 유저정보를 저장하기 전에 비밀번호를 암호화시킨다
userSchema.pre('save', function(next) {
    var user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
});

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword를 암호화하여 데이터베이스에 있는 비밀번호 일치여부를 확인
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    // jsonwebtoken을 이용해서 token을 생성한다.
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // 토큰을 복호화(decode)한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에 클라이언트에서 가져온 토큰과 DB에 보관된 토큰의 일치여부확인
        user.findOne({ "_id": decoded, "token": token}, function (err, user) {
            if(err) return cb(err);
            cb(null, user);
        })
    })


}

// 스키마를 User라는 모델에 넣는다
const User = mongoose.model('User', userSchema)

// 다른 파일에서도 쓸 수 있게 export를 해준다
module.exports = { User }