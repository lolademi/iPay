const { format, transports, createLogger }  = require('winston')
const { combine, timestamp, stack, json, errors } = format 


const createProductionLogger = function()
        {
            const logger = createLogger 
            (
                {
                    'level':'silly',
                    'format': combine
                    (
                        timestamp(),
                        json(),
                        errors({'stack':true})
                    ),
                    transports:
                    [
                        new transports.File({ 'filename':'production_combined.log'}),
                        new transports.File({ 'filename':'production_error.log', 'level':'error' })
                    ]
                }
            )

            return logger 
        }



module.exports = createProductionLogger 