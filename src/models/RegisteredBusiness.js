const mongoose = require('mongoose')
const Schema = mongoose.Schema 



const RegisteredBusinessSchema = new Schema 
        ( 
            { 
                business_name: 
                {
                    type: String, 
                    minlength: 2, 
                    required: true,
                    trim: true 
                },
                business_email:
                {
                    type: String, 
                    minlength: 2, 
                    required: true,
                    trim: true 
                },
                tax_indentity_number:
                {
                    type: String, 
                    minlength: 2, 
                    required: true,
                    trim: true 
                },
                website_url:
                {
                    type: String, 
                    minlength: 2, 
                    required: true,
                    trim: true 
                },
                business_description:
                {
                    type: String, 
                    minlength: 2, 
                    required: true,
                    trim: true 
                },
                business_industry:
                {
                    type: String, 
                    minlength: 2, 
                    required: true,
                    trim: true 
                },
                business_phone_number:
                {
                    type: Number,
                    required: true,
                    trim: true
                },
                business_bank:
                {
                    type: String, 
                    minlength: 2, 
                    required: true,
                    trim: true 
                },
                business_bank_account_number:
                {
                    type: Number, 
                    minlength: 2, 
                    required: true,
                    trim: true 
                },
                business_verified:
                {
                    type: Boolean,
                    required: true,
                    default: false
                },
                logo:
                {
                    type: String
                }

            }
        )


const RegisteredBusiness = mongoose.model('RegisteredBusinesse',RegisteredBusinessSchema)

module.exports = RegisteredBusiness 