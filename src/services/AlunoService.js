const prisma = require("../database/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");
const PaginacaoInvalidaError = require("../errors/PaginacaoInvalidaError");
const OrdenacaoInvalidaError = require("../errors/OrdenacaoInvalidaError");
const AlunoNaoEncontradoError = require("../errors/AlunoNaoEncontradoError");
const EmailDuplicadoError = require("../errors/EmailDuplicadoError");
const AlunoSchema = require("../schemas/AlunoSchema");
const { EMPTY_PATH } = require("zod/v3");

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

  converterId(id){
    const idNumerico = Number(id);
    if(!Number.isInteger(idNumerico) || idNumerico < 1){
      throw new AlunoInvalidoError("O id deve ser um número inteiro positivo!");
    }
    return idNumerico;
  }

  async findUnique(id){
    id = this.converterId(id);
    const aluno = await prisma.aluno.findUnique({
      where: { id }
    });
    if(!aluno){
      throw new AlunoNaoEncontradoError();
    }
    return aluno;
  }

  async update(id, dados){
    id = this.converterId(id);

    // Dados inválidos: reaproveita AlunoInvalidoError (400),
    // problema igual ao create (dados errados)
    const result = AlunoSchema.partial().safeParse(dados ?? {});
    if(!result.success){
      throw new AlunoInvalidoError(result.error.issues[0].message);
    }
    const data = result.data;
    if(Object.keys(data).length === 0){
      throw new AlunoInvalidoError("Envie algum nome ou e-mail pelo menos para ser atualizado.")
    }

    // Aluno não encontrado: reaproveita a verificação do findUnique (404)
    await this.findUnique(id);

     // Email duplicado: exceção própria (409)
    if(data.email){
      const dono = await prisma.aluno.findUnique({where: {email: data.email} });
      if (dono && dono.id !== id){
        throw new EmailDuplicadoError();
      }
    }

    try{
      const alunoAtualizado = await prisma.aluno.update({
        where: { id },
        data
      });
      return alunoAtualizado;
    }catch(e){
      if(e.code === "P2002"){
        throw new EmailDuplicadoError();
      }
      throw e;
    }
  }
}
module.exports = new AlunoService();
