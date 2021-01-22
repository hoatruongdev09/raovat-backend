const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name: { type: String, unique: 1, require: true },
    image: { type: String },
    active: { type: Boolean }
})

module.exports = mongoose.model("Categories", categorySchema)