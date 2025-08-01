const { Client } = require('wppconnect');
const { consultarDados } = require('./utils/google');

let client;

async function iniciarSessao() {
  client = await Client.create({
    session: process.env.SESSION_NAME || 'sessao1',
    catchQR: (qrCode, asciiQR, attempts, urlCode) => {
      console.log('QR Code:', urlCode);
    }
  });

  client.onMessage(async message => {
    if (message.body.length === 11 && message.body.match(/^\d+$/)) {
      const cpf = message.body;
      const resposta = await responderPorCPF(cpf);
      client.sendText(message.from, resposta);
    }
  });
}

async function responderPorCPF(cpf) {
  const dados = await consultarDados(cpf);
  if (!dados) return "CPF não encontrado na base de dados.";
  return dados;
}

module.exports = { iniciarSessao, responderPorCPF };
