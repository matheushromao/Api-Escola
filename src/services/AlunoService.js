const prisma = require("../database/prisma");

class AlunoService{

    async create(Aluno){
        const novoAluno = await prisma.aluno.create({data:aluno});

        return novoAluno;
    }
}

module.exports = new AlunoService();