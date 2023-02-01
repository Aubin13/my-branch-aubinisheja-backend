import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    fullname: {
        type: String,
    },

    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: [true, "An account with this e-mail already exists"],
        lowercase: true,
        trim: true,
        required: [true, "Please provide e-mail"],

    },
    password: {
        type: String,
        required: true
    },
    id: {
        type: Number
    }
})

export default mongoose.model("users", postSchema)

