const ApiError = require("./ApiError");

class AlunoNaoEncontradoError extends ApiError{
    constructor(message="Aluno não encontrado, tente novamente!", statusCode=404){
        super(message, statusCode);
    }
}

module.exports = AlunoNaoEncontradoError;