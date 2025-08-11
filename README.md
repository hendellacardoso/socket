# Socket App

Aplicativo Node.js para comunicação via Socket.IO.
---

## 📋 Requisitos

- Servidor Linux (Ubuntu/Debian recomendado)
- Acesso SSH
- Node.js (versão LTS recomendada)
- Git
- PM2 (process manager)

---

## 🚀 Instalação

### 1. Atualizar o sistema e instalar dependências

cd ~
git clone https://github.com/hendellacardoso/socket.git
cd socket
yarn install
npm install -g pm2
pm2 start src/index.js --name socket
pm2 save
sudo pm2 startup systemd -u $USER --hp $HOME
pm2 list
