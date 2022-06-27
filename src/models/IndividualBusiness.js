const mongoose = require('mongoose')
const Schema = mongoose.Schema 


const IndividualBusinessSchema  = new Schema 
        (
            {
                business_name:
                {
                    type: String,
                    minlength: 2, 
                    trim: true, 
                    required: true
                },
                business_description:
                {
                    type: String,
                    minlength: 10, 
                    trim: true, 
                    required: true
                },
                owner_home_address:
                {
                    type: String,
                    trim: true, 
                    required: true
                },
                business_industry:
                {
                    type: String,
                    minlength: 2, 
                    trim: true, 
                    required: true
                },
                business_phone_number: 
                {
                    type: String,
                    minlength: 10, 
                    trim: true, 
                    required: true
                },
                business_bank_name:
                {
                    type: String,
                    trim: true, 
                    required: true
                },
                Business_bank_account_number:
                {
                    type: Number,
                    trim: true, 
                    required: true
                },
                bvn:
                {
                    type: Number,
                    trim: true, 
                    required: true
                },
                business_verified: 
                {
                    type: Boolean,
                    required: true,
                    default: false 
                },
                business_logo:
                {
                    type: String,
                }
            }
        )



const IndividualBusiness = mongoose.model('IndividualBusinesse',IndividualBusinessSchema) 


module.exports = IndividualBusiness 