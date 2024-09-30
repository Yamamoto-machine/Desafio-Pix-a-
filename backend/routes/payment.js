const express = require('express');
const axios = require('axios');
const Payment = require('/models/Payment');
const router = express.Router();

router.post('/initiate', async (req, res) => {
    const { amount } = req.body;

    try {
        // Fazer requisição para a API do Pix Aí com token de integração
        const response = await axios.post(`${process.env.PIX_API_URL}/pagamentos`, {
            amount: amount
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.PIX_INTEGRATION_TOKEN}`
            }
        });

        // Criar pagamento no banco de dados
        const newPayment = new Payment({
            amount: amount,
            pixId: response.data.pixId,
            status: 'pending'
        });

        await newPayment.save();

        res.json({
            success: true,
            payment: newPayment,
            message: 'Pagamento iniciado com sucesso!'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Erro ao iniciar pagamento',
            error: err.message
        });
    }
});

// Rota para receber o webhook do Pix Aí
router.post('/webhook', async (req, res) => {
    const { pixId, status } = req.body;

    try {
        // Encontrar pagamento pelo pixId
        const payment = await Payment.findOne({ pixId });

        if (!payment) {
            return res.status(404).json({ message: 'Pagamento não encontrado' });
        }

        // Atualizar status do pagamento
        payment.status = status;
        await payment.save();

        res.json({ success: true, message: 'Pagamento atualizado com sucesso!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erro ao processar webhook', error: err.message });
    }
});

module.exports = router;

