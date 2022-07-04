const express = require('express')
const router = express.Router() 
const business = require('../controllers/Business/business')


module.exports = (app) => {


    router.post('/otp',business.sendOtp)
    router.post('/otp/validate',business.validateOtp)
    router.get('/getListOfBanks', business.getListOfBanks )
    router.post('/bvn/resolve', business.resolveBvn )
    router.post('/accountDetails/resolve', business.resolveAccountDetails)
    router.post('/create', business.create)

    app.use('/api/v1/business',router) 
}