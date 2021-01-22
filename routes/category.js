const express = require('express')
const routers = express.Router()
const Category = require('../models/category')
const auth = require('../middlewares/auth')
routers.get('/:id', async (req, res) => {
    const id = req.params.id
    if (!id) { return res.status(400).json({ message: "Id not found" }) }
    try {
        const category = await Category.findOne({ "_id": id, "active": true })
        if (!category) { return res.status(404).json({ message: "Category not found" }) }
        res.status(200).json(category)
    } catch (err) {
        res.status(404).json({ message: "Exception", err })
    }
})
routers.get('/', async (req, res) => {
    try {
        const categories = await Category.find()
        res.status(200).json({ categories: categories })
    } catch (err) {
        res.status(404).json({ message: "Exception", err })
    }
})
routers.post('/', auth, async (req, res) => {
    if (req.user.role == 0) {
        return res.status(400).json({ message: "You are not admin" })
    }
    const name = req.body.name
    const image = req.body.image
    if (!name || !image) { return res.status(400).json({ message: "Parameter not valid" }) }
    try {
        const category = new Category({
            name: name,
            image: image
        })
        await category.save()
        res.status(200).json({ message: "Success" })
    } catch (err) {
        res.status(500).json({ message: "Exception", err })
    }
})

module.exports = routers;