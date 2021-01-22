const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const bCrypt = require('bcrypt')
const saltRounds = 10
const { use } = require('../routes/user')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: { type: String, maxlength: 50, required: true },
    lastname: { type: String, maxlength: 50, required: true },
    email: { type: String, trim: true, unique: 1, required: true },
    password: { type: String, minlength: 5 },
    role: { type: Number, default: 0 },
    image: { type: String },
    token: { type: String },
    tokenExp: { type: Number }
})

userSchema.pre('save', function (next) {
    let user = this
    if (user.isModified('password')) {
        bCrypt.genSalt(saltRounds, (err, salt) => {
            if (err) { return next(err) }
            bCrypt.hash(user.password, salt, (err, hash) => {
                if (err) { return next(err) }
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = async function (plainPassword, callback) {

    bCrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) { throw err }
        console.log('match password: ', isMatch)
        callback(isMatch)
    })
}


userSchema.methods.generateToken = async function () {
    let user = this;
    var token = jwt.sign(user._id.toHexString(), 'secret')
    var oneDay = moment().add(25, 'hours').valueOf()

    user.tokenExp = oneDay
    user.token = token
    try {
        let doc = await user.save()
        return doc
    } catch (err) {
        throw err
    }
}
userSchema.statics.findByToken = async function (token) {
    let user = this;
    try {
        let decode = await jwt.verify(token, 'secret')
        let doc = await user.findOne({ '_id': decode, 'token': token, })
        return doc
    } catch (err) {
        throw err
    }
}
module.exports = mongoose.model('User', userSchema)