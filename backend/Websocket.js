const http = require('http');
const WebSocket = require('ws');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log("Cliente conectado");

    // Enviar notificação de pagamento concluído
    app.post('/webhook', (req, res) => {
        const paymentStatus = req.body.status;

        if (paymentStatus === 'completed') {
            ws.send('payment_received');  // Notificar o cliente
        }

        res.sendStatus(200);
    });
});

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
