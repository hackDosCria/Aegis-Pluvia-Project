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
import * as borsh from "borsh";

// Instructions
interface ProgramInstruction {
  instruction: number;
  data: number;
}

function registerDevice(): Buffer {
  const layout = BufferLayout.struct<ProgramInstruction>([
    BufferLayout.u8("instruction"),
    BufferLayout.u16("data"),
  ]);
  const data = Buffer.alloc(layout.span);
  layout.encode({ instruction: 0, data: 5 }, data);
  return data;
}

function registerMeasurement(): Buffer {
  const layout = BufferLayout.struct<ProgramInstruction>([
    BufferLayout.u8("instruction"),
    BufferLayout.u16("data"),
  ]);
  const data = Buffer.alloc(layout.span);
  layout.encode({ instruction: 1, data: 150 }, data);
  return data;
}

//Account definitions
class MeasurementAccount {
  region = 0;
  current_measure = 0;
  constructor(fields: { current_measure: number, region: number } | undefined = undefined) {
    if (fields) {
	  this.region = fields.region;
      this.current_measure = fields.current_measure;
    }
  }
}

const MeasurementSchema = { struct: { region: "u16", current_measure: "u16" } };

const MEASUREMENT_SIZE = borsh.serialize(
  MeasurementSchema,
  new MeasurementAccount(),
).length;

//main program
(async () => {
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");

  // Get Keys
  const payerKeypair = Keypair.generate();
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
    payerKeypair.publicKey,
    (updatedAccountInfo, context) =>
      console.log("Updated account info: ", updatedAccountInfo),
    "confirmed",
  );

  const airdropSignature = await connection.requestAirdrop(
    payerKeypair.publicKey,
    LAMPORTS_PER_SOL,
  );
  await connection.confirmTransaction(airdropSignature);

  // Get Account
  const SEED = 'hello';
  let userPubkey = await PublicKey.createWithSeed(
	payerKeypair.publicKey,
	SEED,
	programId,
  );

  const userAccount = await connection.getAccountInfo(userPubkey);
   if (userAccount === null) {
    console.log(
      'Creating account',
      userPubkey.toBase58(),
    );
    const lamports = await connection.getMinimumBalanceForRentExemption(
      MEASUREMENT_SIZE,
    );

    const transaction = new Transaction().add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: payerKeypair.publicKey,
        basePubkey: payerKeypair.publicKey,
        seed: SEED,
        newAccountPubkey: userPubkey,
        lamports,
        space: MEASUREMENT_SIZE,
        programId,
      }),
    );
    await sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
  }

  //register pluviometer 
  let instruction = new TransactionInstruction({
    keys: [{pubkey: userPubkey, isSigner: false, isWritable: true}],
    programId,
    data: registerDevice(),
  });

  let txHash = await sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [payerKeypair],
  );
  console.log("registration hash:", txHash);
  
  //register measurement 
  instruction = new TransactionInstruction({
    keys: [{pubkey: userPubkey, isSigner: false, isWritable: true}],
    programId,
    data: registerMeasurement(),
  });

  txHash = await sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [payerKeypair],
  );
  console.log("registration hash:", txHash);

})();
