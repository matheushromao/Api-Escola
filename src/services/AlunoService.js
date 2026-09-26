const prisma = require("../database/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");
const PaginacaoInvalidaError = require("../errors/PaginacaoInvalidaError");
const OrdenacaoInvalidaError = require("../errors/OrdenacaoInvalidaError");

const CAMPO_ORDENAVEIS = ["id", "nome", "email", "createAt", "updateAt"];
const ORDENACAO = ["asc", "desc"];

class AlunoService {
  async create(aluno) {
    const { nome, email } = aluno;
    if (!nome || !email) {
      throw new AlunoInvalidoError();
    }
    const novoAluno = await prisma.aluno.create({ data: aluno });
    return novoAluno;
  }

  async findMany(page, pageSize) {
    page = Number(page);
    pageSize = Number(pageSize);
    if (!page || page < 1 || !pageSize || pageSize < 1) {
      throw new PaginacaoInvalidaError();
    }
    order = String(order).toLowerCase();
    if (!CAMPO_ORDENAVEIS.includes(orderBy)) {
      throw new OrdenacaoInvalidaError(
        `orderBy deve conter esses campos: ${CAMPO_ORDENAVEIS.join(", ")}`,
      );
    }
    if (!ORDENACAO.includes(order)) {
      throw new OrdenacaoInvalidaError('order deve ser "asc" ou "desc"!');
    }
    const [alunos, total] = await Promise.all([
      prisma.aluno.findMany({
        skip: (page - 1) * pageSize,
        take: Number(pageSize),
        orderBy: { [orderBy]: order },
      }),
      prisma.aluno.count(),
    ]);
    return {alunos, total};
  }
}
module.exports = new AlunoService();
