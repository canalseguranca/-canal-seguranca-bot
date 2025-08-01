const { create, onMessage } = require('@wppconnect-team/wppconnect');
const axios = require('axios');

create({
  session: 'canal_seguranca',
  catchQR: (base64Qrimg, asciiQR) => {
    console.log('⚠️ Leia o QR Code abaixo para conectar:');
    console.log(asciiQR);
  },
  statusFind: (statusSession) => {
    console.log('🔄 Status da sessão:', statusSession);
  },
  headless: true,
  puppeteerOptions: { args: ['--no-sandbox'] },
})
.then((client) => {
  console.log('✅ Bot Canal de Segurança iniciado!');

  client.onMessage(async (message) => {
    const cpf = message.body.replace(/\D/g, '');

    // Aceita apenas CPFs com 11 dígitos
    if (!/^\d{11}$/.test(cpf)) return;

    try {
      const { data } = await axios.get(`http://localhost:3000/dados/${cpf}`);

      if (!data.BASE_COLABORADORES) {
        await client.sendText(message.from, '❌ CPF não encontrado no Canal de Segurança.');
        return;
      }

      const base = data.BASE_COLABORADORES;
      const prontuario = data.PRONTUARIO || {};
      const relatos = data.RELATOS_SEGURANÇA || {};
      const epi = data.PEDIDO_EPI || {};
      const blitz = data.BLITZ_TRAJETO || {};

      const texto = `
📋 *Canal de Segurança – Consulta por CPF*

👤 *Nome:* ${base["NOME COMPLETO "]}
🪪 *CPF:* ${base["CPF    "]}
📌 *Cargo:* ${base["CARGO "]}
🏢 *Área:* ${base[" ÁREA"]}

⚠️ *Prontuário:*
• Faixa de Risco: ${prontuario["Faixa de Risco"] || "-"}
• Pontos: ${prontuario["Pontos"] || "-"}
• Última Infração: ${prontuario["Última Infração"] || "-"} em ${prontuario["Data Infração"] || "-"}
• CNH: ${prontuario["Categoria CNH"] || "-"} (Vál. ${prontuario["Validade CNH"] || "-"})
• Toxicológico: ${prontuario["Toxicológico"] || "-"} (Venc. ${prontuario["Venc. Toxicológico"] || "-"})

✅ *Relatos de Segurança:*
• Positivos: ${relatos["Ato Positivo"] || "0"}
• Inseguros: ${relatos["Ato Inseguro"] || "0"}
• Condições Inseguras: ${relatos["Condição Insegura"] || "0"}
• Incidentes: ${relatos["Incidente"] || "0"}
• Acidentes: ${relatos[" Acidente"] || "0"}

🧤 *Pedido de EPI:*
• Último EPI: ${epi["Último EPI Retirado"] || "-"}
• Data: ${epi["Data da Retirada"] || "-"}
• [📥 Novo Pedido](${epi["Link Formulário"] || "#"})

🚦 *Blitz de Trajeto:*
• Data: ${blitz["Data Blitz"] || "-"}
• Anomalias: ${blitz["Anomalias Detectadas"] || "-"}
• Reforço: ${blitz["Reforço Preventivo"] || "-"}

Se precisar de ajuda, digite: *Fale com o TST*.
`;

      await client.sendText(message.from, texto);
    } catch (err) {
      console.error('Erro na consulta:', err.message);
      await client.sendText(message.from, '❌ Ocorreu um erro ao consultar o Canal de Segurança.');
    }
  });
})
.catch((error) => console.error('Erro ao iniciar o bot:', error));

