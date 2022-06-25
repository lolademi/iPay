const express = require('express')
const router = express.Router() 
const lead = require('../controllers/Lead/lead.controller')

module.exports = (app) =>
    {
        router.post('/', lead.generate )

        app.use('/api/v1/lead',router)
    }
