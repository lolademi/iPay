require('dotenv').config() // ENV

// Utilities 
const logger = require('../../health/logging/index')
const { serverErrorResponse } = require('../../utils/response/res_500')


// Flutterwave 
const Flutterwave = require('flutterwave-node-v3')
const flw = new Flutterwave( process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY ) 


// Models 
const PaymentLink = require('../../models/PaymentLink')
const MerchantBalance = require('../../models/MerchantBalance') 
const Transaction = require('../../models/Transaction') 


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

                        // Payment Link ID 
                        const link_id = req.params._id

                        // get customers email address and phone_number 
                        const fields = { amount: 1 }
                        // Find payment link 
                        const paymentData = await PaymentLink.findOne({ link_id },fields)
                        const tx_ref = generateTransactionRef(4) + '-' + generateTransactionRef(2)
                        // Payment Session Data 
                        req.session.merchant_id = paymentData.merchant_id 
                        req.session.transactionCurrency = "USD" 
                        req.session.transactionAmount = paymentData.amount 
                        req.session.customer_email = 'esavwede84@gmail.com' 
                        req.session.tx_ref = tx_ref 
                        

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
                            tx_ref,
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

                        // if none of these, go directly to verify 

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
                                const redirect = resonse.meta.authorization.redirect 
                                return res.status(200).redirect(redirect)
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
                              const redirect = resonse.meta.authorization.redirect 
                              return res.status(200).redirect(redirect)
                          }
                    

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

                        const validationType = req.body.validationType // otp 

                        if( validationType === 'otp' )
                        {
                            const response = await flw.Charge.validate({
                                otp: req.body.otp,
                                flw_ref: req.session.flw_ref
                            });
    
                            console.log( response.data.status ) 
                            const transaction_id = response.data.id  // Used to verify payment 
                            // Verify Payment 
                           const paymentComplete = await flw.Transaction.verify({ id: transaction_id });

                           if( paymentComplete.status === 'successful' )
                           {

                            const fields = { _id: 1, main_balance: 1, main_currency: 1, wallets: 1 }
                            const merchant_id = req.session.merchant_id
                            const transaction_currency = req.session.transactionCurrency


                            var merchantBalanceDetails = await MerchantBalance.findOne({ merchant_id },fields)    
                            
                            
                            var { main_currency } = merchantBalanceDetails

                            
                            if( main_currency === transaction_currency )
                            {
                              logger.info(` Main currency ${ main_currency } , is the same as transaction currency, ${ transaction_currency }`)
                              
                              merchantBalanceDetails.main_balance += req.session.transactionAmount 
                              // update value for the currency wallet 
                              let i 
                              for( i = 0; i < merchantBalanceDetails.wallets.length; i++ )
                              {

                                if( merchantBalanceDetails.wallets[i].balance === main_currency )
                                {
                                    merchantBalanceDetails.wallets[i].balance += req.session.transactionAmount 
                                }
                                
                              }
                
                              await merchantBalanceDetails.save() 
                            }
                            else 
                            {
                                logger.info(` Main currency ${ main_currency } , is not the same as transaction currency, ${ transaction_currency }`)
                               
                                // Convert from transaction currency to main currency 
                                const nairaToDollarRate = 500 
                                const dollarAmount = req.session.transactionAmount 
                                const nairaAmount = nairaToDollarRate * dollarAmount 

                                // add amount In Naira to main balance 
                                // add amount In Dollar to USD balance 

                                merchantBalanceDetails.main_balance += nairaAmount 
                                let i 
                                for( i = 0; i < merchantBalanceDetails.wallets.length; i++ )
                                {
                                    if( merchantBalanceDetails.wallets[i].currency === transaction_currency )
                                    {
                                        merchantBalanceDetails.wallets[i].balance  += dollarAmount 
                                    }
                                }
                                

                                merchantBalanceDetails.save() 
                            }

                                // Update transactions  
                                const newTransactionDoc = { tex_ref: req.session.tx_ref, customer_email: req.session.customer_email,
                                channel: 'card', status:'success', currency: req.session.transactionCurrency ,
                                amount: req.session.transactionAmount, description: req.session.customer_email +'\'s payment'}

                                const newTransaction = new Transaction(newTransactionDoc) 
                                const newTransactionSaved = await newTransaction.save() 


                                console.log(" Transaction Updated ")

                                return res.status(200).json({"success": true, "msg":" Payment Complete "})
                                // Redirect to custom redirect if any
                                // Redirect to success page if no custom redirect 

                           }else 
                           if( paymentComplete.status === 'pending' )
                           {
                                // send message of payment processing with transaction_id 
                                // verify payment link can be used to verify payment 
                           }
                           else 
                           {
                                // Transaction Failed 
                           }
                       
                        }

                        

                        // For redirects 
                        const tx_ref = req.query.tx_ref   
                      
                    }
                    catch(err)
                    {
                        logger.error(err)
                        return serverErrorResponse('Server encountered errror while validating payment ',res)
                    }
                }



            
module.exports = { initiate, authorize, validate } 