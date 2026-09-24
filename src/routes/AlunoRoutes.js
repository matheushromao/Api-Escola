const express = require("express");
const AlunoController = require("../controllers/AlunoController");

const router = express.Router();

router.get("/", AlunoController.findMany)
router.post("/", AlunoController.create);

module.exports = router;