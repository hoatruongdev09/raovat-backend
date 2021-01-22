const Post = require('../models/post')
const Category = require('../models/category')
const User = require('../models/user')

const express = require('express')
const routers = express.Router()
const auth = require('../middlewares/auth')
const moment = require('moment')
const router = require('./user')

routers.get('/detail/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    if (!id) { return res.status(400).json({ message: "post id required" }) }
    try {
        var post = await Post.findOne({ "_id": id, active: true })
        if (!post) { return res.status(404).json({ message: "Post not found" }) };
        // if (!post.active) { return res.status(404).json({ message: "Post not found" }) };
        console.log(post)
        const postDetail = {
            title: post.title,
            description: post.description,
            createDate: post.createDate,
            images: post.images,
            author: await User.findOne({ "_id": post.author }),
            category: await Category.findOne({ "_id": post.category, active: true }),
            phone: post.phone,
            address: post.address
        }
        return res.status(200).json(postDetail)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "exception", err })
    }
})
routers.get('/search/:value', async (req, res) => {

})
routers.get('/list', async (req, res) => {
    const category = req.query.category
    const limit = req.query.limit ? req.query.limit : 50
    const index = req.query.index ? req.query.index : 0
    try {
        let post = []
        if (!category) {
            post = await Post.find().sort({ "createDate": 1 }).limit(limit).skip(index)
        } else {
            post = await Post.find({ "category": category }).sort({ "createDate": 1 }).limit(limit).skip(index)
        }
        console.log(post)
        res.status(200).json({ posts: post })
    } catch (err) {
        res.status(500).json({ message: "Exception", err })
    }
})
routers.post('/', auth, async (req, res) => {
    const title = req.body.title
    const description = req.body.description
    const images = req.body.images
    const category = req.body.category
    const phone = req.body.phone
    const address = req.body.address
    const price = req.body.price
    const createDate = moment()
    const author = req.user._id
    if (!title || !description || !images || !category || !phone || !address || !price) {
        return res.status(400).json({ message: "Paramter not valid" })
    }
    try {
        const categoryDetail = await Category.findOne({ "_id": category, active: true })
        if (!categoryDetail) { return res.status(400).json({ message: "Category not valid" }) }
        const post = new Post({
            title: title,
            description: description,
            createDate: createDate,
            images: images,
            author: author,
            category: category,
            phone: phone,
            address: address,
            active: true,
            price: price
        })
        await post.save();
        return res.status(200).json({ message: "Success" })
    } catch (err) {
        return res.status(500).json({ message: "Exception", err })
    }
})

module.exports = routers;