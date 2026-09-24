const express = require("express");
const AlunoController = require("../controllers/AlunoController");

const router = express.Router();

router.post("/", AlunoController.create);

module.exports = router;