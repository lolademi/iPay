require('dotenv').config()
const logger = require('../../health/logging/index')
const { serverErrorResponse } = require('../../utils/response/res_500')
const Flutterwave = require('flutterwave-node-v3')
const flw = new Flutterwave( process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY ) 
const PaymentLink = require('../../models/PaymentLink')



const generateTransactionRef = function(tx_ref_length)
        {
            const characters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
            '0','1','2','3','4','5','6','7','8','9']

            var tx_ref = ''
            let i, random_char 
            for( i = 0; i < tex_ref_length; i++ )
            {
                random_char = characters[ Math.floor( Math.random() * tx_ref_length ) ]
                tx_ref += random_char 
            }

            return tx_ref 
        }

const initiate = async function(req, res, next)
                {
                    try 
                    {

                        const link_id = req.params._id

                        // get customers email address and phone_number 
                        const fields = { amount: 1 }
                        // Find payment link 
                        const paymentData = await PaymentLink.findOne({ link_id },fields)

                        if( !paymentData ){ return res.status(400).json({ "success": false, "msg":" invalid payment link"})}


                        var payload = 
                        {
                            "card_number": "4556052704172643",
                            "cvv": "899",
                            "expiry_month": "01",
                            "expiry_year": "23",
                            "currency": paymentData.currency,
                            "amount": paymentData.amount ,
                            "email": "esavwede84@gmail.com",
                            "phone_number": "08081848029",
                            "fullname": "Flutterwave Developers",
                            "tx_ref":  generateTransactionRef(4) + '-' + generateTransactionRef(2),
                            "redirect_url": paymentData.redirect_url || `http://${req.headers.host}/api/v1/payment/success`,
                            "enckey": process.env.FLUTTERWAVE_ENCRYPTION_KEY
                        }

                        const response = await flw.Charge.card(payload)
                        

                        console.log(' Here ogaga ')
                        console.log( response ) 


                        if( response.meta.authorization.mode === 'redirect' ) // Only the data.id is needed to verify the payment 
                        {
                            console.log(' Authorization mode is redirect ') 
                            req.session.transaction_id = response.data.id // transaction id is needed to verify payment 
                            req.session.flw_ref = response.data.flw_ref 

                            req.session.save() 

                            return res.status(200).redirect( response.meta.authorization.redirect) 
                        }

                        if( response.meta.authorization.mode === 'pin')
                        {
                            req.session.paymentAuthType = 'pin'
                            req.session.save() 
                            console.log(' User pin required for authorization ')

                            var authorization = { "mode":"pin", "pin":" "}

                            req.session.pin_auth_obj = authorization 
                            req.session.payload = payload 
                            return res.status(200).redirect('/api/v1/payment/cardPinAuthorization')
                        }

                        if( response.meta.authorization.mode === 'avs_noauth') 
                        {
                            console.log('authorization mode is avs_noauth ')

                            req.session.paymentAuthType = 'avs_noauth'
                            req.session.save() 

                            let i  
                            const fieldKeys = response.meta.authorization.fields 
                            var authorization = { "mode":"avs_noauth" }

                            for( i = 0; i < fieldKeys; i++ )
                            {
                                authorization[fieldKeys[i]] = " " 
                            }


                            req.session.avs_auth_obj = authorization 
                            req.session.payload = payload 
                            return res.status(200).redirect('/api/v1/payment/avsAuthorization')
                        }

                    }
                    catch(err)
                    {
                        logger.error(err)
                        return serverErrorResponse('Server encountered errror while initiating payment ',res)
                    }
                }

const authorize = async function(req, res, next )
                {
                    try 
                    {

                        const authorizationType = req.session.paymentAuthType 

                        if( authorizationType === 'pin' )
                        {
                            console.log(' Card Pin authorization ')
                            console.log(' User entered pin ')
                            
                            const cardPin = req.body.cardPin 
                            console.log(cardPin)
                            const authorization = {
                                "mode":"pin",
                                "pin":"3310"
                            }


                            var payload = req.session.payload 
                            payload.authorization = authorization 


                            const response = await flw.Charge.card(payload)
                            const validationMode = response.meta.authorization.mode 
                            req.session.flw_ref = response.data.flw_ref 
                            req.session.save() 

                            if( validationMode === "otp" )
                            {
                                console.log(" Validation mode is otp ")
                                return res.status(200).redirect('/api/v1/payment/otp')
                            }


                            if( validationMode === "redirect")
                            {
                                console.log(" Validation mode is redirect ")
                                return res.send(' All good ') 
                            }
                            
                        }





                        if( authorizationType === 'avs_noauth' )
                        {
                            console.log(' avs Pin authorization ')
                            console.log(' User entered avs details ')
                            
                          const authorization = req.session.avs_auth_obj 
                          console.log( authorization ) 
                          var payload = req.session.payload 
                          payload.authorization = 
                          {
                               "mode": "avs_noauth",
                               "city":  "San Francisco",
                                "address":  "69 Fremont Street",
                                "state":  "CA",
                                "country":  "US",
                                "zipcode":  "94105"
                          } 


                          flw.Charge.card(payload)
                          .then((response)=>{
                            console.dir( response )
                            const validationMode = response.meta.authorization.mode 
                      
                          req.session.flw_ref = response.data.flw_ref 
                          req.session.save() 

                          if( validationMode === "otp" )
                          {
                              console.log(" Validation mode is otp ")
                              return res.status(200).redirect('/api/v1/payment/otp')
                          }


                          if( validationMode === "redirect")
                          {
                              console.log(" Validation mode is redirect ")
                              return res.redirect(response.meta.authorization.redirect) 
                          }

                            return res.send(' All good ')
                          })
                          
                        }
                        
                    }
                    catch(err)
                    {
                        logger.error(err)
                        return serverErrorResponse('Server encountered errror while authorizing payment ',res)
                    }
                }

const validate = async function(req, res, next)
                {
                    try 
                    {
                        const response = await flw.Charge.validate({
                            otp: req.body.otp,
                            flw_ref: req.session.flw_ref
                        });

                        console.log( response.data.status ) // 

                        return res.status(200).send(" All good , last thing is to verify ")
                    }
                    catch(err)
                    {
                        logger.error(err)
                        return serverErrorResponse('Server encountered errror while validating payment ',res)
                    }
                }


module.exports = { initiate, authorize, validate } 