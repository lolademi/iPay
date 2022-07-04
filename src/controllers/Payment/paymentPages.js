require('dotenv').config()
const logger = require('../../health/logging/index')
const { serverErrorResponse } = require('../../utils/response/res_500')


// Flutterwave 
const Flutterwave = require('flutterwave-node-v3')
const flw = new Flutterwave( process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY ) 


// Models 
const PaymentLink = require('../../models/PaymentLink') 

        
const getCardDetails = async function(req, res, next)
{
    try 
    {
        console.log(" In here ogaga ")

        const link_id = req.params.link_id 
        const fields = { amount: 1, name: 1, description: 1, currency: 1 } 
        const paymentDetails = await PaymentLink.findOne({ link_id },fields )

        const payload = { link_id, amount: paymentDetails.amount, name: paymentDetails.name, description: paymentDetails.description,
        currency: paymentDetails.currency }

        return res.status(200).render('payWithCard',payload)
    }
    catch(err)
    {
        logger.error(err)
        return serverErrorResponse('Server encountered errror while displaying payment page',res)
    }
}


const getCardPinAuthDetails = async function(req, res, next)
                {
                    try 
                    {
                        return res.status(200).render('cardPinAuthorization')
                    }
                    catch(err)
                    {
                        logger.error(err)
                        return serverErrorResponse('Server encountered errror while getting pin page ',res)
                    }
                }


                const getAvsAuthDetails = async function(req, res, next)
                {
                    try 
                    {
                        return res.status(200).render('avsAuthorization')
                    }
                    catch(err)
                    {
                        logger.error(err)
                        return serverErrorResponse('Server encountered errror while getting avs details page ',res)
                    }
                }



                const getOtp = async function(req, res, next)
                {
                    try 
                    {
                        return res.render('otp')
                    }
                    catch(err)
                    {
                        logger.error(err)
                        return serverErrorResponse('Server encountered errror while getting avs details page ',res)
                    }
                }


                const success = async function(req, res, next) 
                {
                    try 
                    {
                        const txRef = req.query.tx_ref
                        
                        return res.render('paymentSuccessful')
                    }
                    catch(err)
                    {
                        logger.error(err)
                        return serverErrorResponse('Server encountered errror while authorizing payment ',res)
                    }
                }

module.exports = { getCardDetails, getCardPinAuthDetails, getAvsAuthDetails, getOtp, success }