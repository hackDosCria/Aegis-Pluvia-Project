import {
	Keypair,
	Connection,
	PublicKey,
	LAMPORTS_PER_SOL,
	TransactionInstruction,
	Transaction,
	sendAndConfirmTransaction,
} from "@solana/web3.js";
import * as fs from 'fs'
import * as path from 'path';

const PROGRAM_KEYPAIR_PATH = path.join(
	path.resolve(__dirname, "../../dist/program/"),
	"hello_solana-keypair.json"
);

async function main() {
	console.log("launching client");

	//connect to devnet
	let connection = new Connection('https://api.devnet.solana.com', 'confirmed');

	//programs public key
	const secretKeyString = await fs.readFile(PROGRAM_KEYPAIR_PATH, 'utf8');
	const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
	const programKeypair = Keypair.fromSecretKey(secretKey);
	let programId: PublicKey = programKeypair.publicKey;

	//generate account
	const triggerKeypair = Keypair.generate();
	const airdropRequest = await connection.requestAirdrop(
		triggerKeypair.publicKey,
		LAMPORTS_PER_SOL,
	);
	await connection.confirmTransaction(airdropRequest);

	//Make transaction
	console.log('Pinging the program', programId.toBase58());
	const instruction = new TransactionInstruction({
		keys: [{pubkey: triggerKeypair.publicKey, isSigner: false, isWritable: true}],
		programId,
		data: Buffer.alloc(0),
	});
	await sendAndConfirmTransaction(
		Connection,
		new Transaction().add(instruction),
		[triggerKeypair],
	);
};

main().then(
	() => process.exit(),
	err => {
		console.error(err);
		process.exit(-1);
	},
);
