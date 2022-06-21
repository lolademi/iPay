// Utils 
const logger = require('../../health/logging/index') // Logger 
const { serverErrorResponse } = require('../../utils/response/res_500') // Error Response For server 
const { checkUserExists } = require('../../utils/functions/user/user.function') // Check if User exists 
const { sendMail } = require('../../utils/email/sendmail') // Mail Sender 
const { hashPassword }  = require('../../utils/functions/password.function') // Password Hashing 
const { getMailBody }  = require('../../utils/email/getMailBody')// Signup Email 
const crypto = require('crypto');// verification string 



// models 
const User = require('../../models/User')


const sendNewUserMail = async function(firstname,email)
{
    const mailBody = await getMailBody('signup',firstname)

    if( !mailBody )
    { 
        return false 
    }
    
    const mailSent = await sendMail(email,mailBody)

     if( !mailSent )
     {
         return false 
     }


     return true 
}




const signup = async function(req, res, next)
        {
            try
            {
                const { firstname, lastname, email, password } = req.body 

                const userExists = await checkUserExists(email) 

                if( userExists )
                {
                    logger.info(`email taken : ${ userExists }`)
                    return res.status(400).json({"success": false, "msg":"email taken"})
                }


                // Hash password 
                const hashedPassword = await hashPassword(password) 
                const emailVerificationCode = crypto.randomBytes(15).toString('hex');
                
                
                const newUserDoc = { firstname, lastname, email, password: hashedPassword, emailVerificationCode } 
                const newUser = new User(newUserDoc) 
                const _now = await newUser.save() 
                console.dir( _now ) 

                const mailSent = await sendNewUserMail(firstname,email)  
                console.log(' mailsent is ' + mailSent ) 
                
                if( !mailSent ){ await User.deleteOne({ email });  return serverErrorResponse(res," Error encountered during signup ") }

                return res.status(201).json({"success": true, "msg":" new user created "})
            }
            catch(err)
            {
                logger.error(err)
                return serverErrorResponse(res," Error encountered during signup ")
            }
        }


module.exports = { signup } 