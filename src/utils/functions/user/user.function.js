const User = require('../../../models/User')


const checkUserExists = async function(email)
                {
                        const userExists = await User.findOne({email},{ email: 1, _id: 0})
                        return userExists
                }


module.exports = { checkUserExists }