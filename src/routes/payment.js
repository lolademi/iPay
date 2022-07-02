

const express = require('express')
const router = express.Router() 
const payment = require('../controllers/Payment/payment')
const paymentPages = require('../controllers/Payment/paymentPages')


module.exports  = (app) =>
{

    router.get('/:link_id', paymentPages.getCardDetails )
    router.post('/:link_id', payment.initiate ) 
    router.get('/auth/avs', paymentPages.getAvsAuthDetails) 
    router.get('/auth/pin', paymentPages.getCardPinAuthDetails )
    router.post('/auth/authorize', payment.authorize )
    router.get('/validate/otp', paymentPages.getOtp )
    router.get('/success', paymentPages.success )
    
    app.use('/api/v1/payment', router)
}