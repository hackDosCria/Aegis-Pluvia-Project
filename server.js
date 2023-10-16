const express = require('express');
const { Connection, PublicKey } = require('@solana/web3.js');

const app = express();

// Configurar a conexão com a rede Solana Devnet
const connection = new Connection('https://api.devnet.solana.com');

app.get('/accountInfo/:accountPublicKey', async (req, res) => {
    const accountPublicKey = new PublicKey(req.params.accountPublicKey);

    try {
        const accountInfo = await connection.getAccountInfo(accountPublicKey);

        if (!accountInfo) {
            res.status(404).send('Informações da conta não encontradas');
            return;
        }

        res.json(accountInfo);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.get('/block/:blockNumber', async (req, res) => {
	const blockNumber = parseInt(req.params.blockNumber, 10); // Convertendo para número
    try {
        // Consultar informações da blockchain com base no número do bloco
        const block = await connection.getConfirmedBlock(blockNumber);
        res.json(block);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.get('/programAccounts/:programPublicKey', async (req, res) => {
    const programPublicKey = new PublicKey(req.params.programPublicKey);

    try {
        // Consulta todas as contas pertencentes a um programa com base na chave pública do programa
        const programAccounts = await connection.getProgramAccounts(programPublicKey);

        if (!programAccounts || programAccounts.length === 0) {
            res.status(404).send('Nenhuma conta encontrada para o programa especificado');
            return;
        }

        res.json(programAccounts);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor está rodando na porta ${PORT}`);
});

