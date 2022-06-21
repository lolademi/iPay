var express = require('express');
var router = express.Router();


// controllers 
const  user = require('../controllers/User/user.controller')



module.exports = (app)=>
  {

      // Endpoints 
      router.post('/', user.signup)



      // Add Endpoints to app 
      app.use('/signup',router) 
  }