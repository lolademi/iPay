const mongoose = require('mongoose')

const Schema = mongoose.Schema 




const UserSchema = new Schema
    (
        {
            firstname: 
            {
                type: String, 
                required: true, 
                trim: true, 
                minlength: 2
            },
            lastname:
            {
                type: String, 
                required: true,
                trim: true, 
                minLength: 2 
            },
            email:
            {
                type: String, 
                required: true,
                unique: true,
                trim: true, 
                minlength: 3
            },
            password:
            {
                type: String, 
                required: true, 
                minlength: 8
            },
            emailVerificationCode:
            {
                type: String, 
                required: true
            },
            isVerified:
            {
                type: Boolean, 
                required: true, 
                default: false
            },
            isAdmin:
            {
                type: Boolean, 
                required: true, 
                default: false
            },
            joined_on:
            {
                type: Date, 
                required: true,
                default: Date.now, 
                immutable: true
            }       
        }
    )



    const User = mongoose.model('users',UserSchema)


    module.exports = User 