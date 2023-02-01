import mongoose from 'mongoose';
import Comment from './comment.model.js';
import Like from './like.model.js';

const postSchema = mongoose.Schema(
  {
    cover: String,
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    comments: [Comment],
    likes: [Like],
  },
  {
    timestamps: true,
  },
);

postSchema.pre('remove', function (next) {
  Comment.remove({ post_id: this._id }).exec();
  next();
});

const Post = mongoose.model('Post', postSchema);
export default Post;



// import mongoose from "mongoose";

// const postSchema = mongoose.Schema({
//     title: String,
//     description: String,
//     date: {
//         type: Date,
//         default: Date.now
//     }
// })

// export default mongoose.model("posts", postSchema)