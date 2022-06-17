const { format, createLogger, transports }  = require('winston')
const {  printf, combine, timestamp, colorize, label,errors, stack } = format

const logFormat = printf(({ label, level, message, timestamp, stack })=>{
    return `{"timestamp":${ timestamp },    "label":${ label },     "level":${ level },     "message":${ stack || message }}`
})


const createDevelopmentLogger = function()
        {
            const logger = createLogger
            (
                {
                    level:'silly',
                    'format': combine
                    (
                        colorize(),
                        label({'label':'server log'}),
                        timestamp({'format':'YYYY-MM-DD HH:mm:ss'}),
                        errors({"stack": true}),
                        logFormat
                    ),
                    transports:
                    [
                        new transports.Console()
                    ] 
                }
            )

            return logger 

        }




module.exports = createDevelopmentLogger 