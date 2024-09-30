const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const http = require('http'); // Importa o módulo HTTP
const socketIo = require('socket.io'); // Importa o socket.io

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para CORS
app.use(cors());

// Middleware para requisições com JSON
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB conectado"))
    .catch((err) => console.log("Erro ao conectar ao MongoDB", err));

// Rota inicial de teste
app.get('/', (req, res) => {
    res.send("API do backend de pagamento funcionando!");
});

// Rota de exemplo para webhook
app.post('/webhook', (req, res) => {
    const payload = req.body;
    console.log('Webhook recebido:', payload);

    // Aqui você pode emitir um evento para os clientes conectados pelo WebSocket
    io.emit('paymentReceived', payload);

    res.status(200).send('Webhook recebido com sucesso!');
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

// Cria o servidor HTTP a partir da aplicação Express
const server = http.createServer(app);

// Inicializa o Socket.IO com o servidor HTTP
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3001", // Define a origem do frontend
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Configura o Socket.IO para lidar com conexões
io.on('connection', (socket) => {
    console.log('Novo cliente conectado:', socket.id);

    // Lida com eventos de pagamento iniciado
    socket.on('initiatePayment', (data) => {
        console.log(`Pagamento iniciado: ${data.amount}`);

        // Simula a conclusão de um pagamento após 5 segundos
        setTimeout(() => {
            socket.emit('paymentReceived', { message: 'Pagamento recebido com sucesso!', amount: data.amount });
        }, 5000);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

// Inicia o servidor na porta especificada
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


