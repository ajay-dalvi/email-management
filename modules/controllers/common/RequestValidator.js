/**
 * RequestValidator module
 *
 * @author Ajay Dalvi
 * @version 1.0
 * @since 1.0
 */

'use strict';


//Imports
var express = require('express');
var router = express.Router();
var logger = require('../../utils/Logger');
var Constants = require('../../commons/Constants');
var ErrorCodes = require('../../commons/ErrorCodes');
var EmailMgmtError = require('../../commons/EmailMgmtError');
var CommonRequestProcessor = require("./CommonRequestProcessor");
var emailValidator = require('email-validator');

/**
 * Validate require parameters for sending email
 */
router.post(Constants.EMAIL_MGMT_EMAIL_CONTEXT, function(req, res, next) {
    logger.info("RequestValidator:: validating email send payload");
    console.log("RequestValidator:: validating email send payload");
    var emailSendPayLoad = req.body;
    
    var missingFields = [];
    if (!emailSendPayLoad.to || !(emailSendPayLoad.to.trim())) {
        missingFields.push('to');
    }
    if (!emailSendPayLoad.from || !(emailSendPayLoad.from.trim())) {
        missingFields.push('from');
    }

    if (!emailSendPayLoad.subject || !(emailSendPayLoad.subject.trim())) {
        missingFields.push('subject');
    }

    if (!emailSendPayLoad.text || !(emailSendPayLoad.text.trim())) {
        missingFields.push('text');
    }
    
    if(missingFields.length>0){
        var errorMessage = 'Following fields are missing : '+missingFields;
        CommonRequestProcessor.handleResponse(req, res, new EmailMgmtError(errorMessage, ErrorCodes.INVALID_EMAIL_SEND_PAYLOAD));
    }
    else if(!validateEmailField(emailSendPayLoad.to, true)){
        var errorMessage = "Invalid email ids found in 'to' field";
        CommonRequestProcessor.handleResponse(req, res, new EmailMgmtError(errorMessage, ErrorCodes.INVALID_EMAIL_SEND_PAYLOAD));
    }else if(!validateEmailField(emailSendPayLoad.from, false)){
        var errorMessage = "Invalid email ids found in 'from' field";
        CommonRequestProcessor.handleResponse(req, res, new EmailMgmtError(errorMessage, ErrorCodes.INVALID_EMAIL_SEND_PAYLOAD));
    }else if(emailSendPayLoad.cc && emailSendPayLoad.cc.trim() && !validateEmailField(emailSendPayLoad.cc, true)){
        var errorMessage = "Invalid email ids found in 'cc' field";
        CommonRequestProcessor.handleResponse(req, res, new EmailMgmtError(errorMessage, ErrorCodes.INVALID_EMAIL_SEND_PAYLOAD));
    }else if(emailSendPayLoad.bcc && emailSendPayLoad.bcc.trim() && !validateEmailField(emailSendPayLoad.bcc, true)){
        var errorMessage = "Invalid email ids found in 'bcc' field";
        CommonRequestProcessor.handleResponse(req, res, new EmailMgmtError(errorMessage, ErrorCodes.INVALID_EMAIL_SEND_PAYLOAD));
    }
    else{
        next();
    }
});

function validateEmailField(value, isMultiple){
    
    if(isMultiple){
        var multipleValues = value.split(',');
        for(var i=0; i < multipleValues.length; i++){
            if( !emailValidator.validate(multipleValues[i])){
                return false;
            }
        }
        return true;
    }else{
        if( !emailValidator.validate(value)){
            return false;
        }else{
            return true;
        }
    }
}

module.exports = router;