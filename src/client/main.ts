import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import path from "path";
import { createKeypairFromFile } from "./utils";
import { Buffer } from "buffer";
import * as BufferLayout from "@solana/buffer-layout";

interface Settings {
  instruction: number;
}

function registerDevice(): Buffer {
  const layout = BufferLayout.struct<Settings>([
    BufferLayout.u8("instruction"),
  ]);
  const data = Buffer.alloc(layout.span);
  layout.encode({ instruction: 0 }, data);
  return data;
}

function registerMeasurement(): Buffer {
  const layout = BufferLayout.struct<Settings>([
    BufferLayout.u8("instruction"),
  ]);
  const data = Buffer.alloc(layout.span);
  layout.encode({ instruction: 1 }, data);
  return data;
}

(async () => {
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");

  // Create a test wallet to listen to
  const fromKeypair = Keypair.generate();
  const PROGRAM_PATH = path.resolve(__dirname, "../../dist/program");
  const PROGRAM_KEYPAIR_PATH = path.join(
    PROGRAM_PATH,
    "hello_world-keypair.json",
  );
  const programKeypair = await createKeypairFromFile(PROGRAM_KEYPAIR_PATH);
  let programId: PublicKey;
  programId = programKeypair.publicKey;

  // Register a callback to listen to the wallet (ws subscription)
  connection.onAccountChange(
    fromKeypair.publicKey,
    (updatedAccountInfo, context) =>
      console.log("Updated account info: ", updatedAccountInfo),
    "confirmed",
  );

  const airdropSignature = await connection.requestAirdrop(
    fromKeypair.publicKey,
    LAMPORTS_PER_SOL,
  );

  await connection.confirmTransaction(airdropSignature);

  const instruction = new TransactionInstruction({
    keys: [],
    programId,
    data: registerDevice(),
  });

  const txHash = await sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [fromKeypair],
  );

  console.log("transaction hash:", txHash);
})();
