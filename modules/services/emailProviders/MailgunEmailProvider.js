/**
 * Mailgun Email Provider.
 *
 * @author Ajay Dalvi
 */

const Constants = require('../../commons/Constants');
var logger = require('../../utils/Logger');
var ErrorCodes = require('../../commons/ErrorCodes');
var EmailMgmtError = require('../../commons/EmailMgmtError');
var request = require('request-promise');

function MailgunEmailProvider() {
    
}

MailgunEmailProvider.prototype.sendEmail = function (sendEmailPayload) {
    return new Promise( function (resolve, reject){
    logger.info('Inside Mailgun Email Provider');
    var mailgunURL = Constants.MAILGUN_URL.replace('{DOMAIN_NAME}',Constants.MAILGUN_DOMAIN)
    
        // var auth = 'Basic ' + Buffer.from('api' + ':' + Constants.MAILGUN_API_KEY).toString('base64');
        
        var formData = {
            to: sendEmailPayload.to,
            from: sendEmailPayload.from,
            subject: sendEmailPayload.subject,
            text: sendEmailPayload.text
        };
        
        if(sendEmailPayload.cc){
            formData['cc'] = sendEmailPayload.cc
        }
        if(sendEmailPayload.bcc){
            formData['bcc'] = sendEmailPayload.bcc
        }

        const options = {
            method: 'POST',
            url: mailgunURL,
            auth:{
                user: 'api',
                pass: Constants.MAILGUN_API_KEY
            },
            body: formData,
            resolveWithFullResponse: true,
            simple: false,
            json: true
        };
        
        logger.info('Mailgun request options: '+JSON.stringify(options));

        return request(options).then(function(response){
            if (response.statusCode == 400) {
                log.error("Email send with MailgunEmailProvider Response code: "+response.statusCode+" Body: "+response.body);
                var emailMgmtError = new EmailMgmtError(null, ErrorCodes.EMAIL_MISSING_PARAMETER);
                reject(emailMgmtError);
            }else if (response.statusCode > 400) {
                log.error("Email send with MailgunEmailProvider Response code: "+response.statusCode+" Body: "+response.body);
                var emailMgmtError = new EmailMgmtError(null, ErrorCodes.EMAIL_PROVIDER_FAILURE);
                reject(emailMgmtError);
            }
            else {
                logger.info('Email sending successful using MailgunEmailProvider');
                resolve(response.body)
            }
        }).catch(function (error){
            var emailMgmtError = new EmailMgmtError(null,ErrorCodes.EMAIL_PROVIDER_FAILURE);
            reject(emailMgmtError);
        });
    });
};



module.exports =  MailgunEmailProvider;