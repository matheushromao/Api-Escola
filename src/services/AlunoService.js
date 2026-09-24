const { skip } = require("@prisma/client/runtime/client");
const prisma = require("../database/prisma");

class AlunoService{

    async create(Aluno){
        const novoAluno = await prisma.aluno.create({data:aluno});

        return novoAluno;
    }

    async findMany(page, pageSize){
        const alunos = await prisma.findMany({
            skip: (page-1)*pageSize,
            take: Number(pageSize)
        });

        return alunos;
    }
}

module.exports = new AlunoService();