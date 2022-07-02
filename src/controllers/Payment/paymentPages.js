require('dotenv').config()
const logger = require('../../health/logging/index')
const { serverErrorResponse } = require('../../utils/response/res_500')


// Flutterwave 
const Flutterwave = require('flutterwave-node-v3')
const flw = new Flutterwave( process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY ) 


// Models 
const PaymentLink = require('../../models/PaymentLink') 

const showPaymentDetails = async function(req, res, next)
        {
            try 
            {
                const _id = req.params._id 
                const fields = { amount: 1, name: 1, description: 1 } 
                const paymentLinkDetails = await PaymentLink.findOne({ _id },fields )

                return res.status(200).json({"success": true, paymentLinkDetails })
            }
            catch(err)
            {
                logger.error(err)
                return serverErrorResponse('Server encountered errror while displaying payment page',res)
            }
        }


        
const getCardDetails = async function(req, res, next)
{
    try 
    {
        return res.status(200).render('payWithCard')
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

module.exports = { showPaymentDetails, getCardDetails, getCardPinAuthDetails, getAvsAuthDetails, getOtp, success }