
var response;
function RequestPromiseStub(options){
    return new Promise(function(resolve, reject){
        resolve(response);
    });
}
function setResponse(responseData){
    response = responseData;
}
module.exports = {
    RequestPromise: RequestPromiseStub,
    setResponse: setResponse
}