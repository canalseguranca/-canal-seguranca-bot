# Canal de Segurança no WhatsApp

Este projeto conecta o WhatsApp ao Google Sheets para responder dados por CPF, como: treinamentos, prontuário, relatos, etc.

## Scripts

- `npm install` → instala as dependências
- `npm run start` → inicia o servidor Express (porta 3000)
- `npm run zap` → inicia o WhatsApp (leitor QRCode)

## Endpoints

- `POST /start` → recebe { "cpf": "XXXXXXXXXXX" } e retorna os dados

---
