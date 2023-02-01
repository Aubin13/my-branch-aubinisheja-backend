import express from 'express'
import users from '../models/user.js'

/**
 * @swagger
 * /users:
 *   get:
 *     summary: for getting access to users
 *     tags: [users]
 *     description: We are getting users here
 *     responses:
 *       200:
 *         description: whatever
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */


const usersRoutes = express.Router();
usersRoutes.get('/users', async(req, res)=> {
    const getUser = await users.find()
    res.status(200).json(getUser)
})

usersRoutes.post('/users', async(req, res)=> {
    const insertUsers= new users({
        fullname: req.body.fullname,
        email: req.body.email,
        username:req.body.username,
        password: req.body.password, 
        date: new Date().toDateString()
    })
    await insertUsers.save()
	res.status(200).json(insertUsers)
})

usersRoutes.delete('/users/:id', async(req, res)=> {
    try {
        const id = req.params.id
        await users.deleteOne({
            _id: id
        })
        res.status(200).json('the user have been deleted for sure')
        
    } catch (error) {
        console.log(error)
        res.status(404).json('user not found!')
        
    }
})







export default usersRoutes