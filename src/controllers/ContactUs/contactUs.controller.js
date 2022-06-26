const ContactUs = require('../../models/ContactUs')
const logger = require('../../health/logging/index')
const { serverErrorResponse } = require('../../utils/response/res_500')

const contact = async function(req, res, next)
        {
            try 
            {
           
                if( !req.body.firstname || !req.body.email )
                {
                    return res.status(400).json({ success: false, "msg":" check request body and try again "})
                }


                const newContactUsDoc = req.body 
                const newContactUs = new ContactUs(newContactUsDoc)
                await  newContactUs.save() 

                logger.info(' contact us document created ')
                return res.status(201).json({"success": true, "msg":" contact us document created "})
            }
            catch(err)
            {
                logger.error(err) 
                return serverErrorResponse(res,' server encountered error while creating contact us document ')
            }
        }


module.exports = { contact } 