import express from 'express'
import http from 'http'
import { v4 as uuidv4} from 'uuid'
uuidv4()

const router = express.Router()

let users = [

]
router.post('/', (req, res) =>{
    const user = req.body;
    const userWithId = { ...user, id: uuidv4()}
    users.push(userWithId);
    res.send('user added!')
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