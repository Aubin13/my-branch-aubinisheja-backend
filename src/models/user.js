import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String
})

export default mongoose.model("user", postSchema)