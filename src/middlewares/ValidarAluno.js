const { response } = require("express");
const AlunoSchema = require("../schemas/AlunoSchema");

const ValidarAluno = (request, response, next) => {
    const result = AlunoSchema.safeParse(request.body);
    if(!result.success){
        const errors = result.error.issues.map((e)=>{
            return {
                campo: e.path[0],
                message: e.message
            }
        });
        return response.status(200).json({error: errors});
    }
    request.body = result.data;
    next();
}

module.exports = ValidarAluno;