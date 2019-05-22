/**
 * @author Ajay Dalvi
 */

"use strict";

module.exports = Object.freeze({

    "INVALID_EMAIL_SEND_PAYLOAD" : { statusCode : 400, errorCode : 1000, message : "Invalid email send request"},
    "INTERNAL_SERVER_ERROR"   : { statusCode : 500, errorCode : 2000, message : "Internal server error occurred."},
    "EMAIL_PROVIDER_FAILURE" : { statusCode : 500, errorCode : 3000, message : "Email provider failure to process email request"},
    "EMAIL_MISSING_PARAMETER" : { statusCode : 500, errorCode : 5000, message : "Missing required parameter in email request"}
});
