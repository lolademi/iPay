var express = require('express');
var router = express.Router();


// controllers 
const  transaction = require('../controllers/Transaction/transaction')


module.exports = (app)=>
  {

      // Endpoints 
    router.get('/', transaction.getAll )
    router.get('/:tx_ref', transaction.getOne )

      // Add Endpoints to app 
      app.use('/api/v1/transaction',router) 
  }