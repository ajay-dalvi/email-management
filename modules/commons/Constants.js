/**
 * @author Ajay Dalvi
 */

var constants = {

    /**
     * Express Application related constants
     */
    APPLICATION_PORT : process.env.APPLICATION_PORT || 8080,

    EMAIL_MGMT_BASE_CONTEXT : "/api/v1",
    EMAIL_MGMT_VERSION_CONTEXT : "/version",
    EMAIL_MGMT_EMAIL_CONTEXT : "/email",
    
    /**
     * Log related constants
     */
    LOGLEVEL: process.env.LOG_LEVEL || "debug",
    LOGSDIR: "logs",
    LOGFILEPREFIX: "email-mgmt",
    LOGFILESIZE: 10000000,
    NUMBEROFLOGFILES: 10,
    REQUESTENTITYSIZE: "100mb",
    ACCESSLOGFILESIZE : 10000000,

    /**
     * mailgun related properties
     */
    MAILGUN_API_KEY: process.env.MAILGUN_API_KEY || '',
    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN || '',
    MAILGUN_URL: 'https://api.mailgun.net/v3/{DOMAIN_NAME}/messages',

    /**
     * sendgrid related properties
     */
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
    SENDGRID_URL: 'https://api.sendgrid.com/v3/mail/send'
    
};

module.exports = constants;