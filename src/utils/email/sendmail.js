require('dotenv').config() 
const nodemailer = require('nodemailer')
const logger = require('../../health/logging/index')



const sendMail = async function(email,html)
                    {
                        try 
                        {

                            
                            const transporter = nodemailer.createTransport
                                (
                                    {
                                        'service':"gmail",
                                        'tls': {
                                            rejectUnauthorized: false
                                        },
                                        'auth':
                                        {
                                            'user': process.env.TEST_EMAIL,
                                            'pass': process.env.TEST_EMAIL_PASSWORD
                                        }
                                    }
                                )

                            const mailBody = 
                            {
                                from: process.env_TEST_EMAIL,
                                to: email,
                                subject:'Receive Account Activation',
                                text:' Click on the link to activate your receive account ',
                                html
                            }


                            const transCon = await transporter.sendMail(mailBody)
                            console.log(` Mail result Content ${ transCon }`)
                            return true 
                        }
                        catch(err)
                        {
                            logger.error(err)
                            return false 
                        }
                    }


module.exports = { sendMail }