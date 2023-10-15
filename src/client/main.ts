import { Connection } from "@solana/web3.js";
import { getProgramId, getUserKeypair } from "./utils";
import {
  registerMeasureInstruction,
  registerPluviometerInstruction,
  transactionHash,
} from "./transactions";
import { checkAccount, getUserAccount } from "./accounts";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

//main program
(async () => {
  const connection = new Connection("https://api.devnet.solana.com/", "confirmed");

  // Get Keys
  const payerKeypair = await getUserKeypair();
  let programId = await getProgramId();

  // Get Account
  const seed = "hello";
  let accountPubkey = await getUserAccount(
    seed,
    payerKeypair.publicKey,
    programId,
  );
  console.log("Account hash:", accountPubkey.toBase58());
  await checkAccount(connection, seed, accountPubkey, payerKeypair, programId);

  //register pluviometer
  let instruction = registerPluviometerInstruction(5, programId, accountPubkey);
  let txHash = await transactionHash(connection, instruction, payerKeypair);
  console.log("registration hash:", txHash);

  //register measurement
  instruction = registerMeasureInstruction(55, programId, accountPubkey);
  txHash = await transactionHash(connection, instruction, payerKeypair);
  console.log("measure hash:", txHash);

  //wait for interval
  await sleep(60000);

  //register measurement
  instruction = registerMeasureInstruction(50, programId, accountPubkey);
  txHash = await transactionHash(connection, instruction, payerKeypair);
  console.log("measure hash:", txHash);
})();
