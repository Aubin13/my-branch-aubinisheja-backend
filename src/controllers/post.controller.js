import Post from '../models/post.js';

const allPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ statusCode: 200, success: true, data: [...posts] });
  } catch (error) {
    res.json({ success: false, data: [{ message: error.message }] });
  }
};
const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      res.status(404).send({
        statusCode: 404,
        success: false,
        data: [{ message: "Post doesn't exist!" }],
      });
    } else {
      res.status(200).json({ statusCode: 200, success: true, data: [post] });
    }
  } catch (error) {
    res.send({ success: false, data: [{ message: "Post doesn't exist!" }] });
  }
};

const createPost = async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json({ statusCode: 201, success: true, data: [newPost] });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: [{ message: `Error creating post: ${error.message}` }],
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    });
    if (!post) {
      res.status(404).send({
        statusCode: 404,
        success: false,
        data: [{ message: "Post doesn't exist!" }],
      });
    } else {
      await post.save();
      res.status(200).json({ statusCode: 200, success: true, data: [post] });
    }
  } catch (error) {
    res.status(404);
    res.json({
      statusCode: 404,
      success: false,
      data: [{ message: "Post doesn't exist!" }],
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      res.status(404).json({
        statusCode: 404,
        success: false,
        data: [{ message: "Post doesn't exist!" }],
      });
    } else {
      await post.deleteOne();
      res.status(200).json({
        statusCode: 200,
        success: true,
        data: [{ message: 'Post successfully deleted', body: post }],
      });
    }
  } catch (error) {
    res.status(404).json({
      statusCode: 404,
      success: false,
      data: [{ message: error.message }],
    });
  }
};

const allComments = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate({
        path: 'comments.user',
        model: 'User',
        select: 'surname givenName email',
      })
      .populate({
        path: 'comments.post',
        model: 'Post',
        select: 'title caption',
      });
    let allComments = [];
    posts.forEach((post) => {
      allComments = allComments.concat(post.comments);
    });
    res
      .status(200)
      .json({ statusCode: 200, success: true, data: [...allComments] });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, data: [{ message: error.message }] });
  }
};
const getAllComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: 'comments.user',
        model: 'User',
        select: 'surname givenName',
      })
      .populate({
        path: 'comments.post',
        model: 'Post',
        select: 'title caption',
      });
    const comments = post.comments;
    res
      .status(200)
      .json({ statusCode: 200, success: true, data: [...comments] });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, data: [{ message: error.message }] });
  }
};

const createComment = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.user;

    if (!id) {
      res.status(404).json({
        statusCode: 404,
        success: false,
        data: [{ message: 'Must select a post to comment!' }],
      });
    } else if (!user) {
      res.status(405).json({
        statusCode: 405,
        success: false,
        data: [{ message: 'Must be logged in to comment' }],
      });
    } else if (id && user) {
      try {
        const postRelated = await Post.findById(id);
        if (!postRelated) {
          res.status(404).json({
            statusCode: 404,
            success: false,
            data: [{ message: "Post doesn't exist!" }],
          });
        } else {
          postRelated.comments = [
            ...postRelated?.comments,
            {
              user,
              post: postRelated,
              comment: req.body.comment,
            },
          ];
          await postRelated.save();
          const postResponse = {
            comment: req.body.comment,
            user: { surname: req.user.surname, givenName: req.user.givenName },
          };
          res.status(201).json({
            statusCode: 201,
            success: true,
            data: [
              { message: 'Posted comment successfully', body: postResponse },
            ],
          });
        }
      } catch (error) {
        res.status(500).json({
          statusCode: 500,
          success: false,
          data: [{ message: 'Internal Server Error' }],
        });
      }
    }
  } catch (error) {
    res.json({ success: false, data: [{ message: error.message }] });
  }
};

const deleteComment = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postID });
    if (!post) {
      res.status(404).send({
        statusCode: 404,
        success: false,
        data: [{ message: "Post doesn't exist!" }],
      });
    } else {
      const comments = post.comments.filter(
        ({ _id }) => _id != req.params.commentID,
      );
      post.comments = comments;
      await post.save();
      res.status(200).json({
        statusCode: 200,
        success: true,
        data: [{ message: 'Comment successfully deleted', body: post }],
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, data: [{ message: err.message }] });
  }
};

const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).send({
        statusCode: 404,
        success: false,
        data: [{ message: 'Post not found!' }],
      });
    }
    //check if the post is already liked
    const alreadyLiked = post.likes.find(
      (like) => like.user.toString() === req.user._id.toString(),
    );
    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (like) => like.user.toString() !== req.user._id.toString(),
      );
    } else {
      post.likes.push({
        user: req.user._id,
        post: req.params.postId,
      });
    }
    await post.save();
    res.status(201).json({
      statusCode: 201,
      success: true,
      data: [{ message: 'Successful', body: post }],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  allPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  allComments,
  getAllComments,
  createComment,
  deleteComment,
  toggleLike,
};