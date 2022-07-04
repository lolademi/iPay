require('dotenv').config() 


// Utils 
const logger = require('../../health/logging/index')
const { serverErrorResponse } = require('../../utils/response/res_500')


// Models 
const Transaction = require('../../models/Transaction') 


const getAll = async function(req, res, next)
        {
            try 
            {
                const merchant_id = "62c32a3a7b7d619b20830f4c"
                const fields = { date: 1, status: 1, description: 1, currency: 1, amount: 1, channel: 1, 
                customer_emai: 1 }
                const transactions = await Transaction.find({ merchant_id }, fields) 

                return res.status(200).json({ "success": true, transactions })
            }
            catch(err)
            {
                logger.error(err)
                return serverErrorResponse('Error occured while fetching transactions',res)
            }
        }


const getOne = async function(req, res, next)
        {
            try 
            {
                const tx_ref = req.params.tx_ref 
                const fields = { date: 1, status: 1, description: 1, currency: 1, amount: 1, channel: 1, 
                customer_emai: 1 }
                const transactions = await Transaction.findOne({ tx_ref }, fields) 

                return res.status(200).json({ "success": true, transactions })
            }
            catch(err)
            {
                logger.error(err)
                return serverErrorResponse('Error occured while fetching transaction details',res)
            }
        }



module.exports = { getAll, getOne } 