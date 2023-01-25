import express from 'express'
import http from 'http'
import User from '../models/user.js'
import { v4 as uuidv4} from 'uuid'
uuidv4()

const router = express.Router()

let users = []
router.post('/', (req, res) =>{
    let user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        id: uuidv4()
    });
    res.send(`user ${user.username} added!`)
})

router.get('/',(req, res) =>{
    console.log(users)
    res.send(users)
})

router.get('/:id', (req, res)=>{
    const {id} = req.params
    const userFind = users.find((user) => user.id === id)
    res.send(userFind)
})

router.delete('/:id', (req,res)=>{
    const {id} = req.params;
    users = users.filter((user) => user.id != id)
})

router.patch('/:id', (req, res)=> {
    const {id} =req.params
    const {firstName, lastName, age} = req.body
    const userUpdate = users.find((user) => user.id ===id)
    if(firstName) userUpdate.firstName = firstName
    if(lastName) userUpdate.lastName = lastName
    if(age) userUpdate.age = age
    res.send("User updated")
    console.log("user updated")
})

export default router;