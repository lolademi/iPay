const Lead = require('../../models/Lead')
const logger = require('../../health/logging/index')
const { serverErrorResponse } = require('../../utils/response/res_500')


const generate = async function(req, res, next)
        {
            try 
            {
                const email = req.body.email 

                if( !email )
                {
                    return res.status(400).json({"success": false, "msg":" check email "})
                }

                const newLeadDoc = { email }
                const newLead = new Lead(newLeadDoc)
                await  newLead.save() 

                logger.info(' new lead created ')
                return res.status(201).json({"success": true, "msg":" new lead created "})
            }
            catch(err)
            {
                logger.error(err) 
                return serverErrorResponse(res,' server encountered error while creating lead')
            }
        }


module.exports = { generate } 