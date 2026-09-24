require('dotenv/config');
const express = require("express");
const AlunoRoutes = require("./routes/AlunoRoutes");

const app = express();
app.use(express.json());
app.use("/alunos", AlunoRoutes);

app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`);
})