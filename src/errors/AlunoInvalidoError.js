const ApiError = require("./ApiError");

class AlunoInvalidoError extends ApiError{
    constructor(message="Nome e E-mail são obrigatórios!", statusCode = 400){
        super(message, statusCode);
    }
}

module.exports = AlunoInvalidoError;