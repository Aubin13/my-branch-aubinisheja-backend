import express from 'express';
import post from '../controllers/post.controller.js';
import validates from '../middlewares/validation.middleware.js';
import { postCreation } from '../middlewares/validation/post.validation.js';
import { isAuth, isAdmin } from '../middlewares/authentication.js';
import { commentCreation } from '../middlewares/validation/comment.validation.js';
const router = express.Router();

/**
 * @swagger
 * /post/all:
 *    get:
 *      tags: [post routes]
 *      description: Returns all posts from our database
 *      responses:
 *        200:
 *          description: Get all posts from our API
 */
router.get('/post/all', post.allPosts); // all posts
/**
 * @swagger
 * /post/get/{postId}:
 *    get:
 *      tags: [post routes]
 *      summary: returns a one post should provide postId from our database
 *      parameters:
 *        - name: postId
 *          in: path
 *          description: provide postId
 *          required: true
 *      responses:
 *        200:
 *          description: success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/post'
 *        404:
 *          description: not found
 */
router.get('/post/get/:id', post.getPost); // individual post
/**
 * @swagger
 * /post/create/:
 *   post:
 *     summary: Create a new post
 *     tags: [post routes]
 *     requestBody:
 *       description: please fill all required fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInput'
 *     responses:
 *       '201':
 *         description: Created
 */
router.post('/post/create',
  [isAuth, isAdmin, validates(postCreation)],
  post.createPost,
); // create post

/**
 * @swagger
 * /post/update/{postId}:
 *   patch:
 *     summary: Update a post only by admin
 *     tags: [post routes]
 *     parameters:
 *      - name: postId
 *        in: path
 *        description: provide postId
 *        required: true
 *     requestBody:
 *       description: please fill all required fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInput'
 *     responses:
 *       '201':
 *         description: Created successfully
 */
router.patch(
  '/post/update/:id',
  [isAuth, isAdmin, validates(postCreation)],
  post.updatePost,
); // update post
/**
 * @swagger
 * /post/delete/{postId}:
 *    delete:
 *      tags: [post routes]
 *      summary: deleting one post
 *      parameters:
 *        - name: postId
 *          in: path
 *          description: provide postId
 *          required: true
 *      responses:
 *        200:
 *          description: success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/post'
 *        404:
 *          description: not found
 */
router.delete('/post/delete/:id', [isAuth, isAdmin], post.deletePost); // delete post

/**
 * @swagger
 * /all-comments:
 *    get:
 *      tags: [post routes]
 *      description: Returns all comments from our database
 *      responses:
 *        200:
 *          description: Get all comments from our API
 */
router.get('/all-comments', [isAuth, isAdmin], post.allComments); // all comments in the db

/**
 * @swagger
 * /post/{postId}/comment/all:
 *    get:
 *      tags: [post routes]
 *      description: Returns all comments from one post
 *      parameters:
 *        - name: postId
 *          in: path
 *          description: provide postId
 *          required: true
 *      responses:
 *        200:
 *          description: Get all comments on a post from our API
 */
router.get('/post/:id/comment/all', post.getAllComments); // all comments on an individual post

/**
 * @swagger
 * /post/create/comment/{postId}:
 *   post:
 *     summary: Create a new comment
 *     tags: [post routes]
 *     requestBody:
 *       description: please fill all required fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInput'
 *     parameters:
 *        - name: postId
 *          in: path
 *          description: provide postId
 *          required: true
 *     responses:
 *       '201':
 *         description: Created
 */
router.post(
  '/post/create/comment/:id',
  [isAuth, validates(commentCreation)],
  post.createComment,
); // create post

/**
 * @swagger
 * /post/{postId}/delete/comment/{commentId}:
 *    delete:
 *      tags: [post routes]
 *      summary: deleting one comment
 *      parameters:
 *        - name: commentId
 *          in: path
 *          description: provide commentId
 *          required: true
 *        - name: postId
 *          in: path
 *          description: provide postId
 *          required: true
 *      responses:
 *        200:
 *          description: success
 *        404:
 *          description: not found
 */
router.delete(
  '/post/:postID/delete/comment/:commentID',
  [isAuth, isAdmin],
  post.deleteComment,
); // delete comment

/**
 * @swagger
 * /like/{postId}:
 *    post:
 *      tags: [post routes]
 *      summary: adding or removing a like
 *      parameters:
 *        - name: postId
 *          in: path
 *          description: provide postId
 *          required: true
 *      responses:
 *        200:
 *          description: success
 *        404:
 *          description: not found
 */
router.post('/like/:postId', [isAuth], post.toggleLike);

export default router;


// import express from "express";
// import posts from '../models/post.js'

// const router = express.Router()
// router.get('/posts', (req, res) =>{
//     res.send('helloo')
//     console.log("sdjadsd")
// })

// router.post('/posts', (req, res)=>{
//     console.log('Hiya')
// })

// export default router