app.post('/webhook', (req, res) => {
    const paymentStatus = req.body.status;

    if (paymentStatus === 'completed') {
        // Enviar uma resposta ao frontend para avisar que o pagamento foi concluído
        // Aqui você pode implementar um sistema de notificação, como WebSocket ou outros
        console.log("Pagamento recebido");
    }

    res.sendStatus(200); // Retorna sucesso
});
