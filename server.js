const { Connection, clusterApiUrl } = require('@solana/web3.js');

// Configurar a conexão com a rede Solana (Devnet)
const connection = new Connection(clusterApiUrl('devnet'));

async function getBlockInfo(blockhash) {
    try {
        // Obter informações do bloco
        const block = await connection.getConfirmedBlock(blockhash);
        if (block) {
            console.log('Número do Bloco:', block.blockNumber);
            console.log('Hash do Bloco:', block.blockhash);
            console.log('Hora de Criação:', new Date(block.blockTime * 1000).toUTCString());
            console.log('Transações:', block.transactions);
            // Adicione aqui mais informações do bloco que você deseja imprimir
        } else {
            console.error('Bloco não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao obter informações do bloco:', error);
    }
}

// Substitua 'coloque_o_blockhash_aqui' pelo blockhash do bloco que você deseja consultar
const blockhash = Buffer.from('6NWLhKfV6ECZYZJDTJLa4HimKeqXWfoUN5HpQZWMUWyz', 'base64');
getBlockInfo(blockhash);

