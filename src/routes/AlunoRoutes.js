const express = require("express");
const AlunoController = require("../controllers/AlunoController");
const ValidarAluno = require("../middlewares/ValidarAluno");

const router = express.Router();

router.get("/", AlunoController.findMany);
router.get("/:id", AlunoController.findUnique);
router.post("/", ValidarAluno, AlunoController.create);

module.exports = router;