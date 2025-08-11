const express = require('express');
const boolParser = require('express-query-boolean');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const app = express();
const routes = require('./routes/index');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');  

app.use(cors());
app.use(express.json({ extended: true, limit: '50mb' }));
app.use(express.text({ extended: true, limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(boolParser());

let fileJSON = path.join(__dirname, '../config.json');
let config = JSON.parse(fs.readFileSync(fileJSON, 'utf-8'));

let server;
const options = {
  key: fs.readFileSync('C:\\APIs\\Certificados\\private.key'),
  cert: fs.readFileSync('C:\\APIs\\Certificados\\certificate.crt') 
};

if (config.ssl) {
    server = https.createServer(options, app);
} else {
    server = http.createServer(app);
}

const activeSessions = {};
let dadosMonitor = '';


// Configurações de socket.io para melhorar a estabilidade da conexão
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    pingTimeout: 60000,
    pingInterval: 25000 
});


io.on('connection', (socket) => {
    let clientId = socket.handshake.query.clientId;

    // Se o cliente não enviar um clientId, crie um novo UUID para ele
    if (!clientId || !activeSessions[clientId]) {
        clientId = uuidv4();  // Cria um UUID
        activeSessions[clientId] = socket.id;
        console.log(`Nova conexão com UUID: ${clientId}`);
    } else {
        console.log(`Cliente reconectado com UUID: ${clientId}`);
    }

    // Envia o clientId para o cliente
    socket.emit('session', { clientId });

    // Manter a sessão ativa para possíveis reconexões
    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    req.config = config;
    req.io = io;
    const oldSend = res.send;
    res.send = async function (data) {
        const content = req.headers['content-type'];
        if (content === 'application/json') {
            data = JSON.parse(data);
        }
        res.send = oldSend;
        return res.send(data);
    };
    next();
});


app.use(routes);




server.listen(config.porta, () => {
    console.log(`Socket está em execução na porta: ${config.porta}`);
    
    io.on('connection', (socket) => {
        
        socket.on('8d1c61f9-82f9-4606-bd60-fe069905728a', (mensagem) => {
            dadosMonitor = mensagem;
        })

        socket.onAny((event, ...args) => {
            io.emit(event, ...args);
        });
        
        socket.on('disconnect', (reason) => {
            console.log(`Cliente desconectado: ${socket.id}, motivo: ${reason}`);
        });

    });

});
