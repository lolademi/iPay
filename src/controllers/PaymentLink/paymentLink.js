require('dotenv').config() 
const { serverErrorResponse } = require('../../utils/response/res_500')
const logger = require('../../health/logging/index')
const PaymentLink = require('../../models/PaymentLink')
const crypto = require('crypto') 



const custom_name_exists = async function(req, res, next)
                {
                    try 
                    {
                        const link_id = req.body.custom_name 
                        const customLinkNameExists = await PaymentLink.find({link_id },{ _id: 1 })

                        if( !customLinkNameExists )
                        {
                            return res.status(200).json({"success": true, "msg":" custom name available "})
                        }

                        return res.status(400).json({"success": false, "msg":" custom name taken "})

                    }
                    catch(err)
                    {
                        logger.error(err)
                        return serverErrorResponse(' Error occured while checking if custom link name taken ') 
                    }
                }


const create = async function(req, res, next )
        {
            try 
            {
                const { owner_id, name, amount, description, currency, redirect_url, custom_name } = req.body
                // create link here        


                var linkCode, link 

                if( !custom_name )
                {
                     linkCode = crypto.randomBytes(15).toString('hex');
                    link = `http://${req.headers.host}/api/v1/payment/${linkCode}`
                }

                if( custom_name )
                {
                    linkCode = custom_name
                     link = `http://${req.headers.host}/api/v1/payment/${linkCode}`
                }

                
                const link_id = linkCode 
                const paymentLinkDoc = { owner_id, name, amount, description, currency, redirect_url, link, link_id }
                if( !redirect_url ){ delete paymentLinkDoc.redirect_url } 
                if( !custom_name){ delete paymentLinkDoc.custom_name } 
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


module.exports = { create, getAll, view, update, deleteLink, custom_name_exists }