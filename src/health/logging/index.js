const createDevelopmentLogger = require('./dev-logger')
const createProductionLogger = require('./pro-logger') 



const ENVIRONMENT = process.env.NODE_ENV || 'development' 
let logger = null 


console.log(` ENVIRONMENT:${ ENVIRONMENT }`)



if( ENVIRONMENT === 'development' )
{
    console.log(' Server running in development ')
    logger = createDevelopmentLogger() 
}
else 
if( ENVIRONMENT === 'production' )
{
    console.log(' Server running in production environment ')
    logger = createProductionLogger()
}
else 
{
    console.log(' Unknown Server Environment ')
    console.log(' No Logger Defined ')
}


module.exports = logger 