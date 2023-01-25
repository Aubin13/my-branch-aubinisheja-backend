import express from 'express'
import 'dotenv/config'
import bodyParser from 'body-parser'
import usersRoutes from './src/routes/users.js'
import mongoose from 'mongoose'
import posts from './src/routes/post.js'


const app = express()
const PORT = 5000;
app.use(bodyParser.json())
app.use('/users', usersRoutes)
app.use('/posts', posts)
app.listen(PORT, ()=> console.log("Server running on port 5000"))
  app.get('/', (request, response) => {
    console.log("listening")
    response.send('<h1>Hey, Every one</h1>')
  })

mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser:true }, ()=> console.log('connected!'))



  // var server= app.listen(8080, function(){
  //   var host = server.address().address
  //   var port = server.address().port
    
  //   console.log("Hello")
  // })
  
