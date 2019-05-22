/**
 * The Email Management Service test cases
 *
 * @author Ajay Dalvi
 * @version 1.0
 * @since 1.0
 */

'use strict';

var supertest = require('supertest');
var assert = require('chai').assert;
var Constants = require('../../modules/commons/Constants');
var ErrorCodes = require('../../modules/commons/ErrorCodes');

//Create proxyquire with noCallThru to suppress actual module usage.
var proxyquire = require('proxyquire').noCallThru();
var requestPromiseStub = require('../stubs/RequestPromiseStub');

var MailgunEmailProvider = proxyquire('../../modules/services/emailProviders/MailgunEmailProvider',{'request-promise': requestPromiseStub.RequestPromise});
var SendGridEmailProvider = proxyquire('../../modules/services/emailProviders/SendGridEmailProvider',{'request-promise': requestPromiseStub.RequestPromise});

var EmailMgmtService = proxyquire('../../modules/services/EmailMgmtService',{'./emailProviders/MailgunEmailProvider': MailgunEmailProvider, './emailProviders/SendGridEmailProvider':SendGridEmailProvider});
var EmailMgmtController = proxyquire('../../modules/controllers/EmailMgmtController',{'../services/EmailMgmtService': EmailMgmtService});


describe('TestExceptionMgmtController', function() {
    const baseUrl = Constants.EMAIL_MGMT_BASE_CONTEXT;
    const emailServiceURL = baseUrl + Constants.EMAIL_MGMT_EMAIL_CONTEXT;

    var app;
    /** Initialize (once). */
    before(function() {

    });

    /** Clean up (once). */
    after(function() {});

    /** Initialize (per test). */
    beforeEach(function() {
        app = proxyquire ('../../app', {'./modules/controllers/EmailMgmtController' : EmailMgmtController});
    });

    /** Clean up (per test). */
    afterEach(function() {
        app.close();
    });

    function responseValidator (expectedErrorCode, done, err, res) {
        if(err){
            done(err);
        }else{
            assert(res.body !== undefined, 'Error response is not received');
            assert((res.body.errorcode !== undefined) && (res.body.errorcode === expectedErrorCode.errorCode),
                'Expected errorCode: ' + expectedErrorCode.errorCode + '. Received errorCode: ' + res.body.errorcode);
            done();
        }
    }

    function urlPoster (app, url) {
        return app.post(url);
    }

    function testWithPayload (url, expectedStatusCode, payload, validator) {
        
        url(supertest(app))
        .type('json')
        .send(payload)
        .expect(expectedStatusCode)
        .end((err, res) => {
            validator (err, res);
        });

    }

    function testWithoutPayload (url, expectedStatusCode, validator) {
        url(supertest(app))
            .type('json')
            .send()
            .expect(expectedStatusCode)
            .end((err, res) => {
                validator (err, res);
            });
    }

    function testEmptyBody (url, expectedErrorCode, done) {
        var payload = {

        };
        testWithPayload (url, expectedErrorCode.statusCode, payload, (err, res) => {
            responseValidator (expectedErrorCode, done, err, res);
        });
    }

    function testWrongPayload (url, expectedErrorCode, payload, done) {
        testWithPayload (url, expectedErrorCode.statusCode, payload, (err, res) => {
            responseValidator (expectedErrorCode, done, err, res);
        });
    }

    describe('testSendEmail - validation scenarios', function() {
        let url = ((app) => {
            return urlPoster(app, emailServiceURL);
        });

        it('Validation of empty body', function (done) {
            testEmptyBody(url, ErrorCodes.INVALID_EMAIL_SEND_PAYLOAD, done);
        });
        
        it('Validation of no from field in send email', function(done) {
            
            var payload = {
                to: 'xyz@example.com',
                subject: 'test email',
                text: "Hi there!"
            }
            testWithPayload(url, ErrorCodes.INVALID_EMAIL_SEND_PAYLOAD.statusCode, payload, (err, res) => {
                responseValidator (ErrorCodes.INVALID_EMAIL_SEND_PAYLOAD, done, err, res);
            });
        });

    });

    describe('testSendEmail - send email validation scenarios', function() {
        let url = ((app) => {
            return urlPoster(app, emailServiceURL);
        });

        it('Validation of empty body', function (done) {
            testEmptyBody(url, ErrorCodes.INVALID_EMAIL_SEND_PAYLOAD, done);
        });
        
        it('Validation of no from field in send email', function(done) {
            
            var payload = {
                to: 'xyz@example.com',
                subject: 'test email',
                text: "Hi there!"
            }
            testWithPayload(url, ErrorCodes.INVALID_EMAIL_SEND_PAYLOAD.statusCode, payload, (err, res) => {
                responseValidator (ErrorCodes.INVALID_EMAIL_SEND_PAYLOAD, done, err, res);
            });
        });

        it('Send email scenario with valid response from email provider', function(done) {
            
            var payload = {
                to: 'xyz@example.com',
                from: 'abc@exampl.com',
                subject: 'test email',
                text: "Hi there!"
            }
            var response = {
                statusCode: 200
            }
            requestPromiseStub.setResponse(response);
            testWithPayload(url, 200, payload, (err, res) => {
                done();
            });
        });

        it('Send email scenario with 400 response from email provider', function(done) {
            
            var payload = {
                to: 'xyz@example.com',
                from: 'abc@exampl.com',
                subject: 'test email',
                text: "Hi there!"
            }
            var response = {
                statusCode: 400
            }
            requestPromiseStub.setResponse(response);
            testWithPayload(url, 500, payload, (err, res) => {
                done();
            });
        });

        it('Send email scenario with 401 response from email provider', function(done) {
            
            var payload = {
                to: 'xyz@example.com',
                from: 'abc@exampl.com',
                subject: 'test email',
                text: "Hi there!"
            }
            var response = {
                statusCode: 401
            }
            requestPromiseStub.setResponse(response);
            testWithPayload(url, 500, payload, (err, res) => {
                done();
            });
        });
    });
});