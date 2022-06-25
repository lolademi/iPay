const express = require('express')
const router = express.Router() 
const contactUs = require('../controllers/ContactUs/contactUs.controller')



module.exports = (app) =>
    {
        router.post('/', contactUs.contact )
        app.use('/api/v1/contactUs',router)
    }
