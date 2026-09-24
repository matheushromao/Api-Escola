const z = require("zod");

const AlunoSchema = z.object({
    nome: z.string().trim().min(3, "Nome muito pequeno!"),
    email: z.string().trim().email("E-mail inválido!")
});

module.exports = AlunoSchema;