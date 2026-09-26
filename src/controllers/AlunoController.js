const AlunoService = require("../services/AlunoService");

class AlunoController{

    async create(request, response){
      try{
        const aluno = await AlunoService.create(request.body);
        return response.status(201).json({aluno});
      }catch(e){
        return response.status(e.statusCode || 500).json({error: e.message})
      }
    }

    async findMany(request, response){
      try{
        let {page, pageSize} = request.query;
        page ||= 1;
        pageSize ||= 10;
        orderBy ||= "id";
        order ||= "asc";
        const {alunos, total} = await AlunoService.findMany(page, pageSize, orderBy, order);
        return response.status(200).json({alunos, total});
      }catch(e){
        return response.status(e.statusCode || 500).json({error: e.message});
      }
    }

    async findUnique(request, response){
      try{
        const {id} = request.params;
        const aluno = await AlunoService.findUnique(id);
        return response.status(200).json({aluno});
      }catch(e){
        return response.status(e.statusCode || 500).json({error: e.message})
      }
    }

    async update(request, response){
      try{
        const {id} = request.params;
        const aluno = AlunoService.update(id, request.body);
        return response.status(200).json({aluno});
      }catch(e){
        return response.status(e.statusCode || 500).json({error: e.message});
      }
    }
}

module.exports = new AlunoController;