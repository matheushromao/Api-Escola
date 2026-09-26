const ApiError = require("./ApiError");

class EmailDuplicadoError extends ApiError{
    constructor(message="Este e-mail já existe, por favor escreva outro!", statusCode=409){
        super(message,statusCode);
    }
}

module.exports = EmailDuplicadoError;