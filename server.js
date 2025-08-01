const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { buscarTodosDadosPorCPF } = require('./utils/google');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/dados/:cpf', async (req, res) => {
  try {
    const cpf = req.params.cpf;
    const dados = await buscarTodosDadosPorCPF(cpf);
    res.json(dados);
  } catch (error) {
    console.error('Erro na consulta:', error);
    res.status(500).send('Erro ao buscar os dados');
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});