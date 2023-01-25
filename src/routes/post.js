import express from "express";
import posts from '../models/post.js'

const router = express.Router()
router.get('/posts', (req, res) =>{
    res.send('helloo')
    console.log("sdjadsd")
})

router.post('/posts', (req, res)=>{
    console.log('Hiya')
})

export default router