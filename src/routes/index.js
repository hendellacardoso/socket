const Router = require('express');
const routes = new Router();  

const html = `
    <html>
    <header>
        <title>Servidor</title>
        <style>
            body {
                background-color: #202123;
                color: #fff;
            }
        </style>
    </header>
    <body>
        <center>
            <h1>* * * SERVIDOR SOCKET.IO * * *</h1>
            <hr>
            <h2>Socket On-Line</h2>
        </center>
    </body>
    </html>
`;

routes.post('/api/monitor', function (req, res) {
    try {
        req.io.emit(req.body.evento, JSON.stringify(req.body));
        return res.status(200).json({ status: 200, message: 'Sucesso' });
    } catch (e) {
        return res.status(200).json({ status: 500, message: e.message });
    }
});


routes.post('/api/socket', function (req, res) {
    try {
        req.io.emit(req.body.evento, JSON.stringify(req.body.data));
        return res.status(200).json({ status: 200, message: 'Sucesso' });
    } catch (e) {
        return res.status(200).json({ status: 500, message: e.message });
    }
});


// essa rota é usada para o sistema do maercio
routes.post('/api/maquina', function (req, res) {
    try {
        //console.log(JSON.stringify(req.body));
        req.io.emit('d7a78a8c-c11d-449b-80fe-c764eb982ecc', JSON.stringify(req.body));
        return res.status(200).json({ status: 200, message: 'Sucesso' });
    } catch (e) {
        console.log(e);
        return res.status(200).json({ status: 500, message: e.message });
    }
});
routes.post('/facialGaren', function (req, res) {
    try {
        //console.log('dados recebidos...');
        return res.status(200).json({ status: 200, message: 'Sucesso' });
    } catch (e) {
        return res.status(200).json({ status: 500, message: e.message });
    }
});


routes.get('/', function (req, res) {
    return res.status(200).send(html);
});

module.exports = routes;