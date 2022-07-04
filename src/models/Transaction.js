const mongoose = require('mongoose') 
const Schema = mongoose.Schema 



const TransactionSchema = new Schema 
    (
        {
            merchant_id:
            {
                type: mongoose.Types.ObjectId, 
                required: true 
            },
            tx_ref:
            {
                type: String, 
                trim: true, 
                required: true 
            },
            date:
            {
                type: Date, 
                required: true, 
                default: Date.now 
            },
            status:
            {
                type: String, 
                required: true        
            },
            description:
            {
                type: String, 
                required: true 
            },
            amount: 
            {
                type: Number, 
                required: true 
            },
            currency: 
            {
                type: String, 
                required: true 
            },
            channel: 
            {
                type: String, 
                required: true 
            },
            customer_email:
            {
                type: String, 
                required: true 
            }

        }
    )



    const Transaction = mongoose.model('transaction',TransactionSchema) 

    module.exports = Transaction  