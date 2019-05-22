# email-management
A service to manage email sending

# Developing

Prerequisite for dev setup

        1) Clone the git repo locally

        2) Node and NPM should be installed:
           Download Node version 8.9.3+
		   This will install both Node and NPM.
           You can check the versions post installation by executing below commands in new command prompt.
           node --version
           npm --version

Making the local setup ready:

        1) npm install - Fetches all dependencies required by email-management service
        2) npm test - Will invoke Unit tests

# Running:

Email provider setup:

		email-management is currently use below email providers for sending emails.
		Mailgun - (https://documentation.mailgun.com/en/latest/api-sending.html)
		SendGrid - (https://sendgrid.com/docs/API_Reference/Web_API_v3/index.html)
		
Following steps needs to be done to setup above email providers with email-management service

        Edit file ./modules/commons/Constants.js

		Update following properties for mailgun:
		
		"MAILGUN_API_KEY": "",
		"MAILGUN_DOMAIN": "",
		
		Update following properties for sendgrid:
		
		"SENDGRID_API_KEY": "",
		
Command to run email-management locally:

        npm start

Postman collection export:
		Postman collection export is available at ./EmailManagement.postman_collection.json
		
# email-management acrhitecture overview:

email-management expose API to send emails. Its a NodeJS based service, utilizing express for web server.
Following are the main components of the email-management:
		app.js - Starting point of the service which spawns new web server listening on port 8080

		./modules/controllers/common/RequestValidator.js - Validates the request by applying certain checks. It returns appropriate errorCode, errorMessage combination in case of validation failurers

		./modules/coontrollers/EmailMgmtController - Handles all the validated email sending requests. Basically it handles the HTTP Request by retrieving actual request body and it handles the HTTP Response by attaching proper response payload. It delegates the actual email sending processing to .modules/services/EmailMgmtService.js

		.modules/services/EmailMgmtService.js - Service to handle email sending logic. It configures MailgunEmailProvider and SendGridEmailProvider.
		It uses these email provider sequentially while attempting sending an email. Whenever HTTP response code from an email provider is greater than 400, it tries to attempt email sending with next provider.

Supported features by email-management:

It currently supports sending email from a sender to To list.
It currently supports plain text body types while sending emails.

Following are non implemented features:

Sending attachments in an email

