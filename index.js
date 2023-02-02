import express from 'express'
import 'dotenv/config'
import bodyParser from 'body-parser'
import swaggerUI from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import usersRoutes from './src/routes/users.js'
import mongoose from 'mongoose'
import posts from './src/routes/post.js'
import fetch from 'node-fetch'
import cors from 'cors'


const app = express()
const PORT = 5000;
app.use(bodyParser.json())
app.use(usersRoutes)
app.use(posts)
app.listen(PORT, ()=> console.log("Server running on port 5000"))
  app.get('/', (request, response) => {
    console.log("listening")
    response.send('<h1>Hey, Every one</h1>')
  })


mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser:true }, ()=> console.log('connected!'))
app.use(express.json());

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cors())

const options = {
  swaggerDefinition:{
    openapi: '3.0.0',
    info: {
      title: 'API documentation',
      version: '1.0.0',
      description: 'API Swagger documentations'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          in: 'header',
          bearerformat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }],
    servers: [
      {url: 'http://localhost:5000'}
    ]
  },
  apis: ['./src/routes/*.js']
}

const specs = swaggerJsdoc(options)

app.use('/docs',swaggerUI.serve, swaggerUI.setup(specs))
app.get('/', (req, res) => res.status(200).json({msg: 'Welcomee!'}))
app.use('/',  usersRoutes)

