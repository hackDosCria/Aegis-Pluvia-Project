import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import * as borsh from "borsh";

class MeasurementAccount {
  region = 0;
  current_measure = 0;
  timestamp = 0;
  constructor(
    fields:
      | { current_measure: number; region: number; timestamp: number }
      | undefined = undefined,
  ) {
    if (fields) {
      this.region = fields.region;
      this.current_measure = fields.current_measure;
      this.timestamp = fields.timestamp;
    }
  }
}

const MeasurementSchema = {
  struct: { region: "u16", current_measure: "u16", timestamp: "i64" },
};

const MEASUREMENT_SIZE = borsh.serialize(
  MeasurementSchema,
  new MeasurementAccount(),
).length;

export async function getUserAccount(
  seed: string,
  payerPubkey: PublicKey,
  programId: PublicKey,
): Promise<PublicKey> {
  let userPubkey = await PublicKey.createWithSeed(payerPubkey, seed, programId);
  return userPubkey;
}

export async function checkAccount(
  connection: Connection,
  seed: string,
  accountPubkey: PublicKey,
  payerKeypair: Keypair,
  programId: PublicKey,
) {
  const userAccount = await connection.getAccountInfo(accountPubkey);
  if (userAccount === null) {
    console.log("Creating account", accountPubkey.toBase58());
    const lamports =
      await connection.getMinimumBalanceForRentExemption(MEASUREMENT_SIZE);
    const transaction = new Transaction().add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: payerKeypair.publicKey,
        basePubkey: payerKeypair.publicKey,
        seed: seed,
        newAccountPubkey: accountPubkey,
        lamports,
        space: MEASUREMENT_SIZE,
        programId,
      }),
    );
    await sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
  }
}
