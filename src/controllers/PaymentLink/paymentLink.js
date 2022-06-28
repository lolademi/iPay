require('dotenv').config() 
const { serverErrorResponse } = require('../../utils/response/res_500')
const logger = require('../../health/logging/index')
const PaymentLink = require('../../models/PaymentLink')
const crypto = require('crypto') 

const create = async function(req, res, next )
        {
            try 
            {
                const { owner_id, name, amount, description, currency, redirectUrl} = req.body
                // create link here 
                
                const linkCode = crypto.randomBytes(15).toString('hex');
                const link = `http://${req.headers.host}/api/v1/pay/${linkCode}`

                const paymentLinkDoc = { owner_id, name, amount, description, currency, redirectUrl, link }
                if( !redirectUrl ){ delete paymentLinkDoc.redirectUrl } 
                const newPaymentLink = new PaymentLink(paymentLinkDoc) 

                const paymentLink = await newPaymentLink.save() 
                logger.info(" Payment Link created ")
                return res.status(201).json({"success": true, "msg":" payment link created ", paymentLink })                
            }
            catch(err)
            {
                logger.error(err)
                return serverErrorResponse('Server Encountered error while creating payment link ',res) 
            }
        }


const getAll = async function(req, res, next)
            {
                try 
                {

                    const options = { limit: 5 , skip: 0, sort: { date: -1 } }
                    const fields = { name: 1, amount: 1, currency: 1, description: 1, link: 1}
                    const paymentLinks = await PaymentLink.find({},fields,options)
                    

                    return res.status(200).json({"success": true, "msg":"payment links fetched ", paymentLinks })
                }
                catch(err)
                {
                    logger.error(err)
                    return serverErrorResponse('Server Encountered error while getting payment links ',res) 
                }
            }
      

const view = async function(req, res, next)
                {
                    try
                    {
                        const fields = { name: 1, amount: 1, currency: 1, description: 1, link: 1}
                        const _id = req.params._id 
                        const paymentLink = await PaymentLink.findOne({ _id }, fields )

                        return res.status(200).json({"success": true, "msg":" payment link retrieved ", paymentLink })
                    }
                    catch(err)
                    {
                        logger.error(err)
                        return serverErrorResponse('Server Encountered error while getting payment link',res) 
                    }
                }



const update = async function(req, res, next)
                {
                    try 
                    {

                        const _id = req.params._id 
                        const paymentLink = await PaymentLink.updateOne({ _id },{ $set: req.body },{ new: true })


                        return res.status(200).json({"success": true, "msg":" payment linked updated", paymentLink})
                        
                    }
                    catch(err)
                    {
                        logger.error(err)
                        return serverErrorResponse('Server Encountered error while updating payment link ',res) 
                    }
                }



const deleteLink = async function(req, res, next)
                {
                    try 
                    {
                        const _id = req.params._id 
                        
                        await PaymentLink.deleteOne({ _id })

                        return res.status(200).json({"success": true, "msg":"payment linked deleted "})
                    }
                    catch(err)
                    {
                        logger.error(err)
                        return serverErrorResponse('Server Encountered error while deleting payment link ',res) 
                    }
                }


module.exports = { create, getAll, view, update, deleteLink }