const express = require('express')
const User = require('../models/user')
const auth = require('../middlewares/auth')
const user = require('../models/user')
const router = express.Router()

router.get('/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.email,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})
router.post('/register', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        return res.json({ success: true })
    } catch (err) {
        console.log(err)
        return res.json({ success: false, err })
    }
})
router.post('/login', async (req, res) => {
    try {
        let doc = await User.findOne({ email: req.body.email })
        if (!doc) { return res.json({ loginSuccess: false, message: "Auth failed, email not found" }) }
        console.log(doc)
        doc.comparePassword(req.body.password, (isMatch) => {
            console.log("match password: ", isMatch)
            if (!isMatch) {
                return res.json({ loginSuccess: false, message: "Wrong password" })
            }
            let token = doc.generateToken().then(() => {
                res.cookie('w_authExp', doc.tokenExp)
                res.cookie('w_auth', doc.token).status(200).json({ loginSuccess: true, userId: doc._id })
            })
        })
    } catch (err) {
        console.log(`error: ` + err)
        res.status(400).send(err)
    }
})
router.get('/logout', auth, async (req, res) => {
    try {
        let doc = await user.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" })
        return res.status(200).json({ success: true })
    } catch (err) {
        res.json({ success: false, err })
    }
})
// router.get('/', (req, res) => {
//     res.status(200).json({ message: "ok" })
// })

module.exports = router;