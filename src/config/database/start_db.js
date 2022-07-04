require('dotenv').config() 
const logger = require('../../health/logging/index')
const mongoose = require('mongoose')


const DB_URI = process.env.DATABASE_CONNECTION_STRING 
const DB_OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true }

const startDatabase = async function()
        {

            try 
            {
               
             const createConnection = async function()
                    {
                        try 
                        {
                            await mongoose.connect(DB_URI,DB_OPTIONS)
                        }
                        catch(err)
                        {
                            console.log(err) 
                        }
                    }

                
               createConnection() 
             
                const db = mongoose.connection 

    
                db.once('open',()=>{
                    console.log(" Database Open ")
                })

                db.on('connected',()=>{
                    console.log(" Database connected ")
                })

              
            }
            catch(err)
            {
                logger.error(err) 
            }
           
        }


module.exports = startDatabase