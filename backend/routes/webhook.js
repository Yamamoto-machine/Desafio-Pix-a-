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
