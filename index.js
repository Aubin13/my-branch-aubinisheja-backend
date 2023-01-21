const express = require('express')
const app = express()

  app.get('/', (request, response) => {
      response.send('<h1>Hey, Every one</h1>')
  })

  var server= app.listen(8080, function(){
    var host = server.address().address
    var port = server.address().port
    
    console.log("Hello")
  })
