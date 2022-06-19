const bcrypt = require('bcryptjs') 


const hashPassword = async function(password)
        {
                const hashedPassword = bcrypt.hashSync(password,bcrypt.genSaltSync(10))
                return hashedPassword 
        }


const comparePassword = async function(password, hashedPassword)
        {
                const isValid = bcrypt.compareSync(password,hashedPassword)
                return isValid 
        }


module.exports = { hashPassword, comparePassword } 