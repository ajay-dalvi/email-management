/**
 * Email Management Service.
 *
 * @author Ajay Dalvi
 */

var logger = require('../utils/Logger');
var ErrorCodes = require('../commons/ErrorCodes');
var MailgunEmailProvider = require('./emailProviders/MailgunEmailProvider');
var SendGridEmailProvider = require('./emailProviders/SendGridEmailProvider');

function EmailMgmtService() {

    this.emailProviders = [new MailgunEmailProvider(), new SendGridEmailProvider()];
}

EmailMgmtService.prototype.sendEmail = function (emailSendPayload, callbackHandler) {
    logger.info("About to send email.");
    var providerIndex = 0;

    sendEmailUsingProvider(this.emailProviders, providerIndex, emailSendPayload).then(function (sendEmailResponse){
        callbackHandler(null, sendEmailResponse);
    }).catch(function (error){
        logger.info('Error: '+JSON.stringify(error));
        callbackHandler(error);
    });
};

function sendEmailUsingProvider(emailProviders, providerIndex, emailSendPayload){
    return emailProviders[providerIndex].sendEmail(emailSendPayload).then(function(sendEmailResponse){
        return sendEmailResponse;
    }).catch(function (error){

        logger.info("Error received from provider: "+JSON.stringify(error));
        if(error && error.errorCode === ErrorCodes.EMAIL_PROVIDER_FAILURE.errorCode){
            if(providerIndex < (emailProviders.length - 1) ) {
                logger.info("Attempting with next email provider");
                providerIndex = providerIndex + 1;
                return sendEmailUsingProvider(emailProviders, providerIndex,emailSendPayload);
            }else{
                logger.info("No email provider left to attempt. Sending error back to consumer.");
                throw error;
            }
        }else{
            logger.info("Bad request. Missing parameters.");
            throw error;
        }
    });
}

module.exports =  new EmailMgmtService();