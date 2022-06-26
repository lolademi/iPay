const { readFileSync } = require('fs')
const handlebars = require('handlebars')
const logger = require('../../health/logging/index')


const getMailBody = function(firstname,verificationLink)
                        {
                                try 
                                {
                                     const html = readFileSync( __dirname + "/templates/signup1.html","utf-8")
                                     var new_html = handlebars.compile(html)
                                     const replacements = { firstname, verificationLink }
                                     const final_html = new_html(replacements)
                                     return  final_html
                                }
                                catch(err)
                                {
                                    logger.error(err)
                                    return false
                                }
                        
                        }



module.exports = { getMailBody } 


