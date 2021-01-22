const mongoose = require('mongoose')
const moment = require('moment')

const postSchema = mongoose.Schema({
    title: { type: String, maxlength: 255 },
    description: { type: String },
    createDate: { type: Number },
    images: [String],
    price: { type: Number },
    author: { type: String },
    category: [String],
    phone: { type: String },
    address: { type: String },
    active: { type: Boolean }
})
module.exports = mongoose.model("Posts", postSchema)