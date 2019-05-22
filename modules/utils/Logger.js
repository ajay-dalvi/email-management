/**
 * The logger.
 *
 * @author Ajay Dalvi
 */

'use strict';


//Imports

var logger = require('winston');
var Constants = require('../commons/Constants');
require('winston-daily-rotate-file');

/** Formats the message based on the dynamic data, if any. */
var formatMessage = function(args) {
    var msg = '';
    msg = new Date().toISOString() + " - " + args.level + ": " + args.message;
    return msg;
}

logger.level = Constants.LOGLEVEL;

logger.add(logger.transports.File, {
    filename: Constants.LOGSDIR + "/" + Constants.LOGFILEPREFIX+ ".log",
    maxFiles: Constants.NUMBEROFLOGFILES,
    maxsize: Constants.LOGFILESIZE,
    timestamp: true,
    json: false,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    formatter: formatMessage
});

module.exports = logger;