

const express = require('express')
const router = express.Router() 
const payment = require('../controllers/Payment/payment')



module.exports  = (app) =>
{

    router.get('/', payment.getCardDetails )


    app.use('/api/v1/payment', router)
}