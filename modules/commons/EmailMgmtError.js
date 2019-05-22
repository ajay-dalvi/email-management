/**
 * @author Ajay Dalvi
 */
const ErrorCodes = require('./ErrorCodes');


function EmailMgmtError(message, errorCode) {
    
    if(errorCode){
        this.errorCode = errorCode.errorCode;
        this.statusCode = errorCode.statusCode;
    }else{
        this.errorCode = ErrorCodes.InternalServerError.errorCode;
        this.statusCode = ErrorCodes.InternalServerError.statusCode;
    }
    if (message) {
        this.message = message;
    } 
    else {
        this.message = errorCode.message;
    } 
};

require('util').inherits(EmailMgmtError, Error);

module.exports = EmailMgmtError;
