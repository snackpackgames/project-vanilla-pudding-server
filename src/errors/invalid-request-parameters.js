var InvalidRequestParametersError = function(message) {
   this.name = "InvalidRequestParametersError";
   this.message = message;
};

InvalidRequestParametersError.prototype = Error.prototype;

module.exports = InvalidRequestParametersError;
