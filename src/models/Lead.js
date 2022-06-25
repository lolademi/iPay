const mongoose = require('mongoose')
const Schema = mongoose.Schema 



const LeadSchema = new Schema
    (
        {
            date: 
            {
                type: Date, 
                required: true, 
                default: Date.now 
            },
            email: 
            {
                type: String,
                minlength: 2,
                trim: true, 
                required: true
            }
        }
    )


const Lead = mongoose.model('lead',LeadSchema)

module.exports = Lead 