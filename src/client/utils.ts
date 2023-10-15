import fs from "mz/fs";
import { Keypair, PublicKey } from "@solana/web3.js";
import path from "path";

//Keypairs
async function createKeypairFromFile(filePath: string): Promise<Keypair> {
  const secretKeyString = await fs.readFile(filePath, { encoding: "utf8" });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return Keypair.fromSecretKey(secretKey);
}

export async function getProgramId(): Promise<PublicKey> {
  const PROGRAM_PATH = path.resolve(__dirname, "../../dist/program");
  const PROGRAM_KEYPAIR_PATH = path.join(
    PROGRAM_PATH,
    "hello_world-keypair.json",
  );
  const programKeypair = await createKeypairFromFile(PROGRAM_KEYPAIR_PATH);
  return programKeypair.publicKey;
}

export async function getUserKeypair(): Promise<Keypair> {
  const USER_KEYPAIR_PATH = path.resolve("/home/gcorreia/.config/solana/id.json")
  const keypair = await createKeypairFromFile(USER_KEYPAIR_PATH);
  return keypair;
}
