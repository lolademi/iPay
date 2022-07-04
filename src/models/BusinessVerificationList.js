const mongoose = require('mongoose')
const Schema = mongoose.Schema 




const BusinessVerificationListSchema  = new Schema 
(
    {
        business:
        {
            type: mongoose.Types.ObjectId,
            trim: true,
            required: true
        },
        date_added:
        {
            type: Date, 
            required: true, 
            default: Date.now 
        }
    }
)



const BusinessVerificationList = mongoose.model('BusinessVerificationList',BusinessVerificationListSchema,'BusinessVerificationList')

module.exports = BusinessVerificationList