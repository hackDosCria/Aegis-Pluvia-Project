import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { Buffer } from "buffer";
import * as BufferLayout from "@solana/buffer-layout";

interface ProgramInstruction {
  instruction: number;
  data: number;
}

function registerDevice(region: number): Buffer {
  const layout = BufferLayout.struct<ProgramInstruction>([
    BufferLayout.u8("instruction"),
    BufferLayout.u16("data"),
  ]);
  const data = Buffer.alloc(layout.span);
  layout.encode({ instruction: 0, data: region }, data);
  return data;
}

function registerMeasure(measure: number): Buffer {
  const layout = BufferLayout.struct<ProgramInstruction>([
    BufferLayout.u8("instruction"),
    BufferLayout.u16("data"),
  ]);
  const data = Buffer.alloc(layout.span);
  layout.encode({ instruction: 1, data: measure }, data);
  return data;
}
export function registerPluviometerInstruction(
  region: number,
  programId: PublicKey,
  userPubkey: PublicKey,
): TransactionInstruction {
  let instruction = new TransactionInstruction({
    keys: [{ pubkey: userPubkey, isSigner: false, isWritable: true }],
    programId,
    data: registerDevice(region),
  });
  return instruction;
}

export function registerMeasureInstruction(
  measure: number,
  programId: PublicKey,
  userPubkey: PublicKey,
): TransactionInstruction {
  let instruction = new TransactionInstruction({
    keys: [{ pubkey: userPubkey, isSigner: false, isWritable: true }],
    programId,
    data: registerMeasure(measure),
  });
  return instruction;
}

export async function transactionHash(
  connection: Connection,
  instruction: TransactionInstruction,
  payerKeypair: Keypair,
): Promise<TransactionSignature> {
  let txHash = sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [payerKeypair],
  );
  return txHash;
}
