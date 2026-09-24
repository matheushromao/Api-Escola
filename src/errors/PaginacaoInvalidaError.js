const ApiError = require("./ApiError");

class PaginacaoInvalidaError extends ApiError{
    constructor(message="page e pageSize devem ser números positivos!", statusCode=400){
        super(message, statusCode);
    }
}

module.exports = PaginacaoInvalidaError;