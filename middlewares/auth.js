const User = require('../models/user')
let auth = async (req, res, next) => {
    let token = req.cookies.w_auth

    try {
        var user = await User.findByToken(token)
        if (!user) {
            return res.json({ isAuth: false, error: true })
        }
        req.token = token
        req.user = user
        next()
    } catch (err) {
        throw err
    }
}
module.exports = auth