const mongoose = require('mongoose')
const Schema = mongoose.Schema 




const PaymentLinkSchema = new Schema
        (
            {
                owner_id:
                {
                    type: mongoose.Types.ObjectId, 
                    required: true
                },
                name: 
                {
                    type: String, 
                    required: true, 
                    trim: true
                },
                amount: 
                {
                    type: Number, 
                    required: true, 
                    trim: true
                },
                description:
                {
                    type: String, 
                    required: true, 
                    trim: true
                },
                createdOn:
                {
                    type: Date, 
                    required: true, 
                    default: Date.now 
                },
                link:
                {
                    type: String, 
                    required: true, 
                    trim: true
                },
                currency:
                {
                    type: String, 
                    required: true, 
                    trim: true
                },
                redirect_url:
                {
                    type: String
                },
                paymentCount: 
                {
                    type: Number, 
                    required: true, 
                    default: 0 
                },
                link_id:
                {
                    type: String, 
                    minlength: 5 
                }
            }
        )



        const PaymentLink = mongoose.model('paymentLink',PaymentLinkSchema) 

        module.exports = PaymentLink