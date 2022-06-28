require('dotenv').config()
const logger = require('../../health/logging/index')
const { serverErrorResponse } = require('../../utils/response/res_500')
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



const initiate = async function(req, res, next)
                {
                    try 
                    {
                        const { } = req.body
                    }
                    catch(err)
                    {
                        logger.error(err)
                        return serverErrorResponse('Server encountered errror while initiating payment ',res)
                    }
                }



module.exports = { getCardDetails } 