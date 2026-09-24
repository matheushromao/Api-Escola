const { skip } = require("@prisma/client/runtime/client");
const prisma = require("../database/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");
const PaginacaoInvalidaError = require("../errors/PaginacaoInvalidaError");

class AlunoService{

    async create(Aluno){
        const {nome, email} = aluno;
        if(!nome || !email){
            throw new AlunoInvalidoError();
        }
        const novoAluno = await prisma.aluno.create({data:aluno});
        return novoAluno;
    }

    async findMany(page, pageSize){
        page = Number(page);
        pageSize = Number(pageSize);
        if (!page || page < 1 || !pageSize || pageSize < 1){
            throw new PaginacaoInvalidaError();
        }
        const alunos = await prisma.findMany({
            skip: (page-1)*pageSize,
            take: Number(pageSize)
        });
        return alunos;
    }
}

module.exports = new AlunoService();