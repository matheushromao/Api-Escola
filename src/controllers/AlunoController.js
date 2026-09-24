const AlunoService = require("../services/AlunoService");

class AlunoController{

    async create(request, response){
        const aluno = await AlunoService.create(request.body);
        return response.status(201).json({aluno});
    }

    async findMany(request, response){
      try{
        let {page, pageSize} = request.query;
        page ||= 1;
        pageSize ||= 10;
        const alunos = await AlunoService.findMany(page, pageSize);
        return response.status(200).json({alunos});
      }catch(e){
        return response.status(e.statusCode).json({error: e.message});
      }
    }
}

module.exports = new AlunoController;