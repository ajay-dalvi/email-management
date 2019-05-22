
/**
 * Common request handler.
 * It mainly handles the common part of response sending to consumer.
 *
 * @author Ajay Dalvi
 */

'use strict';


//Imports

var logger = require('../../utils/Logger');
var Constants = require('../../commons/Constants');
var ErrorCodes = require('../../commons/ErrorCodes');
var EmailMgmtError = require('../../commons/EmailMgmtError');

/**
 * Handles response. If there is an error, it would send an error response.
 */
exports.handleResponse = function(req, res, error,responseData) {
    var statusCode;
    if(error){
        if(error instanceof EmailMgmtError ){
            logger.debug(" Error message sent in response "+ error.message);
            statusCode = error.statusCode;
            responseData = {errormessage : error.message, errorcode : error.errorCode}

        }else{
            logger.debug(" Error message sent in response "+ JSON.stringify(error));
            statusCode = 500;
            responseData = {errormessage : JSON.stringify(error), errorcode : ErrorCodes.INTERNAL_SERVER_ERROR.errorCode}
        }
    }
    else{
        statusCode = 200;
    }
    if (!res.headersSent) {
        res.setHeader('Content-Type', 'application/json');
        res.status(statusCode).send(responseData);
    }else{
        logger.info("email-management: handleResponse(): Headers already sent for response")
    }

}