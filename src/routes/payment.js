

const express = require('express')
const router = express.Router() 
const payment = require('../controllers/Payment/payment')
const paymentPages = require('../controllers/Payment/paymentPages')


module.exports  = (app) =>
{

    router.get('/:link_id', paymentPages.getCardDetails ) // Get Card Payment Page 
    router.post('/:link_id', payment.initiate )  // Initiate Payment 


    router.get('/auth/avs', paymentPages.getAvsAuthDetails)  // Get avs details for authorization 
    router.get('/auth/pin', paymentPages.getCardPinAuthDetails ) // Get card Pin for authorization 
    router.post('/auth/authorize', payment.authorize ) // Authorize Payment 

    
    router.get('/validate/otp', paymentPages.getOtp )
    router.get('/validate/verify', payment.validate ) 
    router.get('/success', paymentPages.success )
    
    app.use('/api/v1/payment', router)
}