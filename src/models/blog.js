import mongoose from "mongoose"
const blogSchema = mongoose.Schema({
    title: String,
    image: String,
    content: String,
    author:String,
    date: Date
});

const Blog = mongoose.model('Blogs', blogSchema)
module.exports = Blog;