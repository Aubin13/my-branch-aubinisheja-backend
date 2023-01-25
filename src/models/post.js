import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title: String,
    description: String,
    date: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("posts", postSchema)