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
            for( i = 0; i < tx_ref_length; i++ )
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

                        // Customer Details 
                        var { email, phone, fullname, card_number, cvv, expirationDate } = req.body
                        
                        const expirationArr = expirationDate.split('/') 
                        const expirationMonth = expirationArr[0]
                        const expirationYear = expirationArr[1] 
                        

                        // Payment Details 
                        const link_id = req.params.link_id 
                        const fields = { amount: 1, redirect_url: 1, currency: 1, merchant_id: 1 }
                        const paymentData = await PaymentLink.findOne({ link_id },fields)

                        // Payment Details not found 
                        if( !paymentData ){ return res.status(400).json({ "success": false, "msg":" invalid payment link"})}

                        logger.info(' Fetched Payment Details For session ') //log 
                        logger.info( paymentData ) 

                        // Generate Transaction Reference For Payment 
                        const tx_ref = generateTransactionRef(4) + '-' + generateTransactionRef(2)
                        const customer_redirect = paymentData.redirect_url || `http://${req.headers.host}/api/v1/payment/success`

                        // Store Payment Session Data 
                        req.session.merchant_id = paymentData.merchant_id 
                        req.session.transactionCurrency = paymentData.currency
                        req.session.transactionAmount = paymentData.amount 
                        req.session.customer_email = email 
                        req.session.tx_ref = tx_ref 
                        req.session.customer_phone = phone 
                        req.session.customer_fullname = fullname 
                        req.session.redirect_url = `http://${req.headers.host}/api/v1/payment/validate/verify`
                        req.session.customer_redirect = customer_redirect

                        req.session.save() 
                        
                        logger.info(' Stored payment details for session ') // log 

                        var payload = 
                        {
                            "fullname": req.session.customer_fullname,
                            "card_number": card_number,
                            "cvv": cvv,
                            "expiry_month": expirationMonth,
                            "expiry_year": expirationYear,
                            "currency": req.session.transactionCurrency,
                            "amount": req.session.transactionAmount,
                            "email": req.session.customer_email,
                            "phone_number": req.session.customer_phone,
                            "tx_ref": req.session.tx_ref,
                            "redirect_url": req.session.redirect_url ,
                            "enckey": process.env.FLUTTERWAVE_ENCRYPTION_KEY
                        }


                        logger.info(' Created Payload ')//log 
                        logger.info(' Charging Card ') // log 


                        const response = await flw.Charge.card(payload)
                        
                        logger.info( response ) 
                        console.log( response )
                       

                        const authType = response.meta.authorization.mode

                        if( authType === 'redirect' ) 
                        {
                            

                            logger.info(' Redirect Auth required ')
                            req.session.transaction_id = response.data.id // transaction id is needed to verify payment 
                            req.session.flw_ref = response.data.flw_ref 

                            req.session.save() 

                            return res.status(200).redirect( response.meta.authorization.redirect) 
                        }

                        if( authType === 'pin')
                        {

                            logger.info(' Pin Auth required  ')

                            req.session.paymentAuthType = 'pin'
                            req.session.payload = payload // Save Card Details Payload 
                            req.session.save() 
                            
                            
                            return res.status(200).redirect('/api/v1/payment/auth/pin')
                        }

                        if( authType === 'avs_noauth') 
                        {
                            
                            logger.info(' avs auth method ')

                            req.session.paymentAuthType = 'avs_noauth'
                            req.session.payload = payload 
                            req.session.save()                            
                           
                            return res.status(200).redirect('/api/v1/payment/auth/avs')
                        }

                        // if still here: 
                       // No auth, Just Verify Payment Straight Away 

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
                            const pin = req.body.pin 

                           logger.info(' Pin authorization ')
                           logger.info( pin ) 

                            const authorizationBody = {
                                "mode":"pin",
                                 pin
                            }


                            // Retrieve Payload from session and modify 
                            var payload = req.session.payload 
                            payload.authorization = authorizationBody



                            // Charge Card Again 
                            const response = await flw.Charge.card(payload)
                            const validationMode = response.meta.authorization.mode 

                            // Save Flutterwave reference 
                            req.session.flw_ref = response.data.flw_ref 
                            req.session.save() 


                            if( validationMode === "otp" )
                            {
                                logger.info(' Otp Validation ')
                                return res.status(200).redirect('/api/v1/payment/validate/otp')
                            }


                            if( validationMode === "redirect")
                            {
                                logger.info(' Validation mode is redirect ')
                                res.session.transaction_id = response.data.id 
                                const redirect = resonse.meta.authorization.redirect 
                                return res.status(200).redirect(redirect)
                            }
                            
                        }





                        if( authorizationType === 'avs_noauth' )
                        {
                      
                          var payload = req.session.payload 
                          payload.authorization = 
                          {
                               "mode": "avs_noauth",
                               "city":  req.body.city,
                                "address":  req.body.address,
                                "state":  req.body.state,
                                "country":  req.body.country,
                                "zipcode":  req.body.zipcode 
                          } 


                          flw.Charge.card(payload)
                          .then((response)=>{
                            console.dir( response )
                            const validationMode = response.meta.authorization.mode 
                            
                          req.session.flw_ref = response.data.flw_ref 
                          req.session.save() 


                          if( validationMode === "otp" )
                          {
                              logger.info(' Validation mode is otp')
                              req.session.validationMode = 'otp' 
                              req.session.save() 

                              return res.status(200).redirect('/api/v1/payment/validate/otp')
                          }

                          if( validationMode === "redirect")
                          {
                              logger.info(' validation mode is redirect ')
                              req.session.validationMode = 'redirect' 
                              req.session.transaction_id = response.data.id 
                              
                              req.session.save() 

                              const redirect = response.meta.authorization.redirect 
                              console.log( redirect ) 
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

                        
                        const validationMode = req.session.validationMode 

                        if( validationMode === 'otp' )
                        {

                            logger.info(' started payment validation for otp ')
                            const response = await flw.Charge.validate
                            ({
                                otp: req.body.otp,
                                flw_ref: req.session.flw_ref
                            });
    
                            logger.info(' Validation Complete ')
                            logger.info(  response.data.status  ) 

                            const transaction_id = response.data.id  // Used to verify payment 
                            // Verify Payment 
                           const paymentComplete = await flw.Transaction.verify({ id: transaction_id });

                           if( paymentComplete.status === 'successful' )
                           {

                            logger.info(' Payment Successfull ')
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

                                if( merchantBalanceDetails.wallets[i].currency === main_currency )
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
                                const newTransactionDoc = { tx_ref: req.session.tx_ref, customer_email: req.session.customer_email,
                                channel: 'card', status:'success', currency: req.session.transactionCurrency ,
                                amount: req.session.transactionAmount, description: req.session.customer_email +'\'s payment'}

                                const newTransaction = new Transaction(newTransactionDoc) 
                                const newTransactionSaved = await newTransaction.save() 


                                console.log(" Transaction Updated ")

                                return res.status(200).redirect( req.session.redirect_url ) 
                                

                           }else 
                           if( paymentComplete.status === 'pending' )
                           {
                                // send message of payment processing with transaction_id 
                                // verify payment link can be used to verify payment 

                                return res.status(200).json({"success": false, "msg":"transaction pending "})
                           }
                           else 
                           {
                                // Transaction Failed 
                                return res.status(200).json({"success": false, "msg":"transaction failed"})
                           }
                       
                        }


                        if( validationMode === 'redirect')
                        {

                            logger.info(' Started validation for redirect ') 
                            logger.info(' Validation mode is redirect ')
                            const tx_ref = req.query.tx_ref  
                            const transaction_id = req.session.transaction_id  

                            console.log( transaction_id ) 

                           const paymentComplete = await flw.Transaction.verify({ id: transaction_id });
                           

                           logger.info( paymentComplete) 
                           console.log( transaction_id ) 
                           console.log( paymentComplete )
                           console.log( paymentComplete.data.status ) 


                           if( paymentComplete.data.status === 'successful' )
                           {

                            logger.info(' Payment Successfull ')
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

                                if( merchantBalanceDetails.wallets[i].currency === main_currency )
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
                                const newTransactionDoc = { tx_ref: req.session.tx_ref, customer_email: req.session.customer_email,
                                channel: 'card', status:'success', currency: req.session.transactionCurrency ,
                                amount: req.session.transactionAmount, description: req.session.customer_email +'\'s payment'}

                                const newTransaction = new Transaction(newTransactionDoc) 
                                const newTransactionSaved = await newTransaction.save() 


                                console.log(" Transaction Updated ")

                                return res.status(200).redirect( req.session.customer_redirect ) 
                                

                           }else 
                           if( paymentComplete.data.status === 'pending' )
                           {
                                // send message of payment processing with transaction_id 
                                // verify payment link can be used to verify payment 

                                return res.status(200).json({"success": false, "msg":"transaction pending "})
                           }
                           else 
                           {
                                // Transaction Failed 
                                return res.status(200).json({"success": false, "msg":"transaction failed"})
                           }

                        }
                        

                        
                    }
                    catch(err)
                    {
                        logger.error(err)
                        return serverErrorResponse('Server encountered errror while validating payment ',res)
                    }
                }



            
module.exports = { initiate, authorize, validate } 