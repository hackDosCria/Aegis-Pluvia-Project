import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { getProgramId } from "./utils";
import {
  registerMeasureInstruction,
  registerPluviometerInstruction,
  transactionHash,
} from "./transactions";
import { checkAccount, getUserAccount } from "./accounts";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

//main program
(async () => {
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");

  // Get Keys
  const payerKeypair = Keypair.generate();
  let programId = await getProgramId();

  //get funds
  const airdropSignature = await connection.requestAirdrop(
    payerKeypair.publicKey,
    LAMPORTS_PER_SOL,
  );
  await connection.confirmTransaction(airdropSignature);

  // Get Account
  const seed = "hello"
  let accountPubkey = await getUserAccount(
	seed,
    payerKeypair.publicKey,
    programId,
  );
  await checkAccount(connection, seed, accountPubkey, payerKeypair, programId);

  //register pluviometer
  let instruction = registerPluviometerInstruction(5, programId, accountPubkey);
  let txHash = await transactionHash(connection, instruction, payerKeypair);
  console.log("registration hash:", txHash);

  //register measurement
  instruction = registerMeasureInstruction(205, programId, accountPubkey);
  txHash = await transactionHash(connection, instruction, payerKeypair);
  console.log("measure hash:", txHash);

  //wait for interval
  await sleep(30000);

  //register measurement
  instruction = registerMeasureInstruction(50, programId, accountPubkey);
  txHash = await transactionHash(connection, instruction, payerKeypair);
  console.log("measure hash:", txHash);
})();
