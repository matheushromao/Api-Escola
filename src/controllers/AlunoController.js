const AlunoService = require("../services/AlunoService");

class AlunoController{

    async create(request, response){
        const aluno = await AlunoService.create(request.body);
        return response.status(201).json({aluno});
    }
}

module.exports = new AlunoController;