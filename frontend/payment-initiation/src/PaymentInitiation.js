// src/PaymentInitiation.js
import './PaymentInitiation.css';
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client'; // Importando o socket.io-client

const PaymentInitiation = () => {
    const [amount, setAmount] = useState('');
    const [paymentReceived, setPaymentReceived] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Conectando ao backend com WebSocket (porta 3000)
        const newSocket = io('http://localhost:3000', { transports: ['websocket'] });

        newSocket.on('connect', () => {
            console.log('Conectado ao WebSocket');
        });

        // Escutando o evento de pagamento recebido
        newSocket.on('paymentReceived', (data) => {
            setPaymentReceived(true);
            console.log(data.message); // Exibe a mensagem no console
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect(); // Desconecta ao desmontar o componente
        };
    }, []);

    const handlePayment = (e) => {
        e.preventDefault();
        if (socket) {
            socket.emit('initiatePayment', { amount });
        }
        setPaymentReceived(false); // Reseta a mensagem de pagamento recebido
    };

    return (
        <div className="payment-container" style={{ backgroundColor: 'gray', padding: '1px' }}>
            <h1>Faz Um Pix Aí</h1>
            <form onSubmit={handlePayment}>
                <label htmlFor="amount">Valor do Pagamento:</label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="0.01"
                    step="0.01"
                />
                <button type="submit">Realizar Pagamento</button>
            </form>
            {paymentReceived && <p>Pagamento recebido com sucesso!</p>}
        </div>
    );
};

export default PaymentInitiation;

