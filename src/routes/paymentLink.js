const express = require('express')
const router = express.Router() 
const paymentLink = require('../controllers/PaymentLink/paymentLink')


module.exports = (app) => 
{
    router.post('/', paymentLink.create ) // 
    router.get('/', paymentLink.getAll ) // 
    router.get('/:_id', paymentLink.view ) // 
    router.post('/:_id', paymentLink.update ) // 
    router.delete('/:_id', paymentLink.deleteLink ) // 
    router.get('/nameExists/:name', paymentLink.custom_name_exists ) // 

    app.use('/api/v1/paymentLink', router) 
}