import { v4 as uuidv4 } from 'uuid'
uuidv4()

// export const createUser = (req, res) =>{
//     const user = req.body;
//     const userWithId = { ...user, id: uuidv4()}
//     users.push(userWithId);
//     res.send('user added!')
// }

// require('dotenv').config()

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import users from '../models/user.js'

const getUsers = async (req, res) => {
    const getUser = await users.find()
    res.status(200).json(getUser)
}
const getSingleUser = async (req, res) => {
    try {
        const email = req.params.email
        const user = await users.findOne({
            _id: id
        })
        res.status(200).json(user)

    } catch (error) {
        console.log(error)
        res.status(404).json('user not found!')

    }
}


const postUser = async (req, res) => {
    const insertUsers = new users({
        fullname: req.body.fullname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        date: new Date().toDateString()
    })
    //await signupvalidating(insertUsers,res)
    if (!insertUsers.email) return res.json({ error: "Please provide e-mail" });
    if (!insertUsers.fullname) return res.json({ error: "Provide your Name" });
    if (!insertUsers.username) return res.json({ error: "Username is required" });
    if (!insertUsers.password) return res.json({ error: "Password is required" });
    const email = insertUsers.email
    const oldUser = await users.findOne({ email });

    if (oldUser) {
        return res.status(409).send("Account with this email already exists!");
    }
    bcrypt.hash(insertUsers.password, 10, (err, hash) => {
        if (err) {
            console.log(err)
            res.status(500).json({ message: "An error happened on our side :(" })
        }
        else {
            insertUsers.password = hash
            console.log("password encrypted successfully!")
        }
        const userWithId = { ...users, id: uuidv4() }
        users.push(userWithId)
        insertUsers.save()
        res.status(201).json(insertUsers)
    })

}

const login = async (req, res) => {
    try {
        const _email = await users.findOne({ email: req.body.email });
        if (!_email) return res.status(401).json({ status: "fail", error: "This e-mail does not exist in our database" });
        const pass_match = await bcrypt.compare(req.body.password, user.password);
        if (!pass_match) {
            res.status(401).json({ status: "fail", error: "Invalid password" })
            return;
        }
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET)
        console.log(process.env.ACCESS_TOKEN_SECRET)
        res.status(200).json({ status: "Success", message: `User ${user.fullname} successfully logged in`, token: accessToken });
    } catch (error) {
        res.status(500).json({ status: "Error", error: error.message });
    }
}
//delete user
const deleteuser = async (req, res) => {
    try {
        const id = req.params.id
        await users.deleteOne({
            _id: id
        })
        res.status(200).json('User Deleted')
    } catch (error) {
        console.log(error)
        res.status(404).json('User not found!')
    }
}
const updateuser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await users.findOne({ _id: req.params.id })
        if (req.body.username) {
            user.username = req.body.username
        }

        if (req.body.email) {
            user.email = req.body.email
        }


        if (req.body.password) {
            user.password = req.body.password
        }
        await user.save()
        res.status(200).json('Details updated!')

    } catch (error) {
        console.log(error)
        res.status(404).json('Error 404 :( user cannot be found')

    }
}
module.exports = { getUsers, getSingleUser, postUser, deleteuser, updateuser, login }