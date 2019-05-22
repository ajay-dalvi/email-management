
/**
 * email-management service implementation
 *
 * @author Ajay Dalvi
 */

'use strict';

//Globals
var Version = "1.0";

//Imports
var logger = require('./modules/utils/Logger');
var express = require('express');
var Constants = require('./modules/commons/Constants');

var fs = require('fs');
var http = require('http');
var bodyParser = require('body-parser');
var server;
 

if (!fs.existsSync(Constants.LOGSDIR)) {
    fs.mkdirSync(Constants.LOGSDIR);
}

logger.info("creating express project");
var app = express();

app.use(bodyParser.json({
    limit: Constants.REQUESTENTITYSIZE
})); // Use higher limits
app.use(bodyParser.urlencoded({
    limit: Constants.REQUESTENTITYSIZE,
    extended: true
}));

 logger.info("setting routes");
 // Setup routes
 //Setting up RequestValidator
 app.use(Constants.EMAIL_MGMT_BASE_CONTEXT, require('./modules/controllers/common/RequestValidator'));
 logger.info("setting controller");
 //Setting up EmailMgmtController to handle email send request
 app.use(Constants.EMAIL_MGMT_BASE_CONTEXT + Constants.EMAIL_MGMT_EMAIL_CONTEXT, require('./modules/controllers/EmailMgmtController'));

 logger.info("setting verion API");

/**
 * Returns the version.
 * 
 */
app.get(Constants.EMAIL_MGMT_BASE_CONTEXT+Constants.EMAIL_MGMT_VERSION_CONTEXT, function(req, res, next) {
    logger.info("Email Management version is 1.1");
    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    res.send({version: Version});
});

logger.info("setting default route handler");
/* Default route handler. */
app.use(function(req, res, next) {
    logger.info("No route found. Returning HTTP 404.");
    var statusCode = 404;
    res.status(statusCode).send();
});


logger.info("starting server");
server = http.createServer({}, app).listen(Constants.APPLICATION_PORT, function(err) {
    if (err) {
        logger.error("Email Management: Startup error: %s", err);
    }
    else {
        var port = server.address().port;
        logger.info("Email Management: Email Management REST End Point available at http://%s:%s/", 'localhost', port);
    }
});

logger.info("Application instantiation complete");
console.log("Application instantiation complete");

module.exports = server;