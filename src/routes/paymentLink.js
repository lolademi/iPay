const express = require('express')
const router = express.Router() 
const paymentLink = require('../controllers/PaymentLink/paymentLink')


module.exports = (app) => 
{
    router.post('/', paymentLink.create )
    router.get('/', paymentLink.getAll ) 
    router.get('/:_id', paymentLink.view ) 
    router.post('/:_id', paymentLink.update )
    router.delete('/:_id', paymentLink.deleteLink ) 

    app.use('/api/v1/paymentLink', router) 
}