const { google } = require('googleapis');
require('dotenv').config();

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function buscarAba(sheetId, aba, cpf) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${aba}!A:Z`,
  });
  const linhas = res.data.values;
  const cabecalho = linhas[0];
  const indexCpf = cabecalho.findIndex(h => h.toLowerCase().includes('cpf'));

  const encontrado = linhas.find((linha, i) => i > 0 && linha[indexCpf]?.replace(/\D/g, '') === cpf.replace(/\D/g, ''));
  if (!encontrado) return null;

  const resultado = {};
  cabecalho.forEach((col, i) => resultado[col.trim()] = encontrado[i] || "");
  return resultado;
}

async function buscarTodosDadosPorCPF(cpf) {
  const sheetId = process.env.SPREADSHEET_ID;
  const abas = [
    'BASE_COLABORADORES',
    'PRONTUARIO',
    'RELATOS_SEGURANÇA',
    'PEDIDO_EPI',
    'BLITZ_TRAJETO',
    'TREINAMENTOS',
    'ALERTA_SEGURANCA',
    'BRIGADA_EMERGENCIA'
  ];
  const dados = {};

  for (const aba of abas) {
    dados[aba] = await buscarAba(sheetId, aba, cpf);
  }

  return dados;
}

module.exports = { buscarTodosDadosPorCPF };