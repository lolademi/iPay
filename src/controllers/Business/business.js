require('dotenv').config() 
const logger = require('../../health/logging/index')
const { serverErrorResponse } = require('../../utils/response/res_500')
const axios = require('axios')
const Flutterwave = require('flutterwave-node-v3') 
const flw = new Flutterwave( process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY  );




const getListOfBanks = async function(req, res, next)
            {
                try 
                {
                    const payload = 
                    {
                        "country":"NG"
                    }

                    const response = await flw.Bank.country(payload)

                    return res.status(200).json({"success": true, "banks": response })
                }
                catch(err)
                {
                    logger.error(err)
                    return serverErrorResponse(' Server encountered error while getting list of banks ',res)
                }
            }



const resolveBvn = async function(req, res, next)
            {
                try 
                {
                    const payload = {
                        "bvn": "123456789010"
                    }
                    const response = await flw.Misc.bvn(payload)
                    console.log(response);

                    return res.status(200).json({"success": true, response })
                }
                catch(err)
                {
                    logger.error(err)
                    return serverErrorResponse(' Server encountered error while resolving bvn',res)
                }
            }


const resolveAccountDetails = async function(req, res, next)
            {
                try 
                {
                    const payload = {
                        "account_number": "0690000032",
                        "account_bank": "044"
                    }
                    const response = await flw.Misc.verify_Account(payload)


                    return res.status(200).json({"success": true, response })
                }
                catch(err)
                {
                    logger.error(err)
                    return serverErrorResponse(' Server encountered error while resolving account details ',res)
                }
            }



const sendOtp = async function(req, res, next)
                {
                    try 
                    {

                        
                        // Customer contact details 
                        const name = req.body.name 
                        const email = req.body.email 
                        const phone = req.body.phone 


                        const payload = {
                            "length": 5,
                            "customer":
                            {
                                "name": name, 
                                "email": email,
                                "phone": phone
                            },
                            "sender": "Great Tea",
                            "send": true,
                            "medium": [
                              "whatsapp",
                              "email",
                              "sms"
                            ],
                            "expiry": 5
                          }


                        // otp payload 
                        const data = JSON.stringify(payload)



                          // Configure Axios Transport with otp payload 
                          var config = {
                            method: 'post',
                            url: 'https://api.flutterwave.com/v3/otps',
                            headers: {
                              'Authorization': `Bearer ${ process.env.FLUTTERWAVE_SECRET_KEY}`,
                              'Content-Type': 'application/json'
                            },
                            data : data
                          };
                          

                          axios(config)
                          .then(async function (response) {
                            console.log( typeof response ) 
                            console.log(JSON.stringify(response.data));

                            // store otp and otp reference 
                            req.session.otp = response.data[0].otp 
                            req.session.otp_reference = response.data[0].reference 

                            console.log( req.session.otp ) 
                            console.log( req.session.otp_reference ) 


                            return res.status(200).json({ "success": true, "msg":" otp sent" })
                          })
                          .catch(function (error) {
                            console.log(" Error occured while sending otp ")
                            console.log(error);

                            return res.status(500).json({"success": false, "msg":"error occured while sending otp"})
                          });          

                    }
                    catch(err)
                    {
                        logger.error(err)
                        return serverErrorResponse(' Server encountered error while sending otp to phone number ',res)
                    }
                }



const validateOtp = async function(req, res, next)
                {
               
                        try {

                            const payload = 
                            {
                                "reference":  req.session.otp_reference,
                                "otp": req.body.otp 
                            }

                            const response = await flw.Otp.validate(payload)
                            console.log(response);
                            const responseKeys = Object.keys(response) 

                            if( !responseKeys ) 
                            {
                                return res.status(400).json({"success": false, "msg":"check otp"})
                            }

                            return res.status(200).json({"success": true, "msg":"otp validated"})
                        } catch (error) {
                            logger.error(error)
                            return serverErrorResponse(' Server encountered error while validating otp ',res)
                        }

                }



const create = async function(req, res, next)
                {
                    try
                    {
                        // Get request body and save business details  
                        const { businessType } = req.body 
                        
                        
                    }
                    catch(err)
                    {
                        logger.error(err)
                        return serverErrorResponse(' Server encountered error while creating new business',res)
                    }
                }



module.exports = { sendOtp, validateOtp, getListOfBanks, resolveBvn, resolveAccountDetails, create }