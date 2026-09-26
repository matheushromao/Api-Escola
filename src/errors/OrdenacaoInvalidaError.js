const ApiError = require("./ApiError");

class OrdenacaoInvalidaError extends ApiError{
    constructor(message="Parâmetros de ordenação inválidos!", statusCode=400){
        super(message,statusCode);
    }
}

module.exports = OrdenacaoInvalidaError;