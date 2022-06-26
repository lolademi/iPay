var express = require('express');
var router = express.Router();


// controllers 
const  user = require('../controllers/User/user.controller')



module.exports = (app)=>
  {

      // Endpoints 
      router.post('/signup', user.signup)
      router.get('/verifyEmail/:verificationCode',user.verifyEmail)
      router.post('/signin',user.signin)

      // Add Endpoints to app 
      app.use('/api/v1',router) 
  }