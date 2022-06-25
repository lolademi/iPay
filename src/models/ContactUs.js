const mongoose = require('mongoose')
const Schema = mongoose.Schema 



const ContactUsSchema = new Schema 
        (
            {
                firstname:
                {
                    type: String,
                    minLength: 2, 
                    trim: true, 
                    required: true
                },
                email:
                {
                    type: String,
                    minlength: 2,
                    trim: true, 
                    required: true
                },
                subject:
                {
                    type: String, 
                    minLength: 5
                },
                note:
                {
                    type: String, 
                    minLength: 10
                },
                date:
                {
                    type: Date, 
                    required: true, 
                    default: Date.now 
                }
            }
        )


const ContactUs = mongoose.model('contactu',ContactUsSchema)

module.exports = ContactUs 