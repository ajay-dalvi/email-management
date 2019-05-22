
/**
 * Email Management controller.
 *
 * @author Ajay Dalvi
 */

'use strict';


//Imports
var express = require('express');
var router = express.Router();
var emailMgmtService = require('../services/EmailMgmtService');
var CommonRequestProcessor = require("./common/CommonRequestProcessor");


/**
 * Send email.
 * 
 */
router.post("/", function(req, res, next) {

    var emailSendPayload = req.body;
    emailMgmtService.sendEmail(emailSendPayload, function(error, emailSendResponse) {
        var responseBody=undefined
        if(emailSendResponse !=undefined){
            responseBody = {}
            responseBody.emailSendResponse = emailSendResponse;
        }
        CommonRequestProcessor.handleResponse(req, res, error, responseBody);
    });
 });

module.exports = router;