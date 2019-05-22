/**
 * SendGrid Email Provider.
 *
 * @author Ajay Dalvi
 */

const Constants = require('../../commons/Constants');
var logger = require('../../utils/Logger');
var ErrorCodes = require('../../commons/ErrorCodes');
var EmailMgmtError = require('../../commons/EmailMgmtError');
var request = require('request-promise');

function SendGridEmailProvider() {
    
}


SendGridEmailProvider.prototype.sendEmail = function (sendEmailPayload) {
    return new Promise( function (resolve, reject){
      logger.info('Inside SendGrid Email Provider');
      var sendgridURL = Constants.SENDGRID_URL;
              
      var headers = {};
      headers['Content-Type'] = 'application/json';
      headers['Authorization'] = 'Bearer ' + Constants.SENDGRID_API_KEY 
         
      logger.info('headers: '+ JSON.stringify(headers));
      var requestBody = {
        personalizations: [],
        from: {
          email: sendEmailPayload.from
        },
        subject: sendEmailPayload.subject,
        content: [
          {
            type: "text/plain",
            value: sendEmailPayload.text
          }
        ]
    };

    requestBody['personalizations'] = [{to: generateEmailRecepientPaylaod(sendEmailPayload.to)}];

    if(sendEmailPayload.cc){
      requestBody['cc'] = generateEmailRecepientPaylaod(sendEmailPayload.cc);
    }
    if(sendEmailPayload.bcc){
      requestBody['bcc'] = generateEmailRecepientPaylaod(sendEmailPayload.bcc);
    }

    logger.info('requestBody: '+JSON.stringify(requestBody));
      const options = {
          method: 'POST',
          url: sendgridURL,
          headers: headers,
          body: requestBody,
          resolveWithFullResponse: true,
          simple: false,
          json: true
      };
      logger.info('SendGrid request options: '+JSON.stringify(options));    
      return request(options).then(function(response){
          
          if (response.statusCode == 400) {
            log.error("Email send with SendGridEmailProvider Response code: "+response.statusCode+" Body: "+response.body);
            var emailMgmtError = new EmailMgmtError(null, ErrorCodes.EMAIL_MISSING_PARAMETER);
              reject(emailMgmtError);
          }else if (response.statusCode > 400) {
            log.error("Email send with SendGridEmailProvider Response code: "+response.statusCode+" Body: "+response.body);
            var emailMgmtError = new EmailMgmtError(null, ErrorCodes.EMAIL_PROVIDER_FAILURE);               
            reject(emailMgmtError);
          }
          else {
            logger.info('Email sending successful using SendGridEmailProvider. Response code: '+response.statusCode);
            resolve(response.body)
          }
      }).catch(function (error){
        var emailMgmtError = new EmailMgmtError(null, ErrorCodes.EMAIL_PROVIDER_FAILURE);
        reject(emailMgmtError);
      });
    });
};

function generateEmailRecepientPaylaod(payload){

  var multipleValues = payload.split(',');
  var recepientPayload = []
  for(var i=0; i < multipleValues.length; i++){
    var emailPayload = {}
    emailPayload['email'] = multipleValues[i]; 
    recepientPayload.push(emailPayload);
  }
  return recepientPayload;
}

module.exports =  SendGridEmailProvider;