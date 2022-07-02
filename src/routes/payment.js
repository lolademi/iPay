

const express = require('express')
const router = express.Router() 
const payment = require('../controllers/Payment/payment')
const paymentPages = require('../controllers/Payment/paymentPages')


module.exports  = (app) =>
{

    router.get('/', paymentPages.getCardDetails )
    router.get('/:_id', paymentPages.showPaymentDetails ) 
    router.post('/:_id', payment.initiate ) 
    router.get('/avsAuthorization', paymentPages.getAvsAuthDetails) 
    router.get('/cardPinAuthorization', paymentPages.getCardPinAuthDetails )
    router.post('/authorize', payment.authorize )
    router.get('/otp', paymentPages.getOtp )
    router.get('/success', paymentPages.success )
    
    app.use('/api/v1/payment', router)
}