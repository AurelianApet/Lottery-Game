import * as anchor from "@project-serum/anchor";
import { PROGRAM_ID, POOL_ADDRESS, ADMIN_ADDRESS } from './constants';
import {
    Keypair,
    PublicKey,
    Transaction,
    TransactionInstruction,
    ConfirmOptions,
    SYSVAR_CLOCK_PUBKEY,
    ParsedAccountData,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction
} from "@solana/web3.js";

const idl = require('./idl.json');
const POOL = new PublicKey(POOL_ADDRESS);
const programId = new PublicKey(PROGRAM_ID);

const confirmOption = {
    commitment : 'finalized',
    preflightCommitment : 'finalized',
    skipPreflight : false
}

async function sendTransaction(transaction, signers, wallet, conn) {
    transaction.feePayer = wallet.publicKey
    transaction.recentBlockhash = (await conn.getRecentBlockhash('max')).blockhash;
    transaction.setSigners(wallet.publicKey, ...signers.map(s => s.publicKey));
    if(signers.length !== 0)
      transaction.partialSign(...signers)
    const signedTransaction = await wallet.signTransaction(transaction);
    let hash = await conn.sendRawTransaction(await signedTransaction.serialize());
    await conn.confirmTransaction(hash);
}
  
async function sendAllTransaction(transactions, wallet, conn){
    let commitment = "max"
    let unsignedTxns = []
    let block = await conn.getRecentBlockhash(commitment);
    for(let i =0; i<transactions.length;i++){
        let transaction = transactions[i]
        transaction.recentBlockhash = block.blockhash;
        transaction.setSigners(wallet.publicKey)
        unsignedTxns.push(transaction)
    }
    const signedTxns = await wallet.signAllTransactions(unsignedTxns)
    for(let i=0;i<signedTxns.length;i++){
        try {
          let hash = await conn.sendRawTransaction(await signedTxns[i].serialize())
          await conn.confirmTransaction(hash)
        } catch(error) {
          return {result: false, number: i, kind: 1}
        }
    }
    return {result: true, number: 0, kind: 0}
}

export async function getCurrentRound(connection, wallet) {
  try {
    let provider = new anchor.AnchorProvider(connection, wallet, confirmOption)
    let program = new anchor.Program(idl, programId, provider)

    let roundAccounts = await connection.getProgramAccounts(programId,
      {
        dataSlice: {length: 0, offset: 0},
        filters: [{dataSize: 161}, {memcmp:{offset:8, bytes: POOL.toBase58()}}]
      })
  
    let currentRound = {
      roundName: "0",
      totalTicket : 0,
      ticketSold : 0,
      timeRemained : 0,
      winningTicket : 0,
      adminAddress : ADMIN_ADDRESS,
      winnerAddress : "winner",
      tvl: 0,
      finished: true,
      claimed: true
    }

    if (roundAccounts.length > 0) {
      for (let i = 0; i < roundAccounts.length; i ++) {
        let roundData = await program.account.round.fetch(roundAccounts[i].pubkey);
        if (!roundData.finished) {
          currentRound = {
            roundName: roundData.roundName,
            totalTicket : Number(roundData.totalTicket),
            winningTicket : Number(roundData.winningTicket),
            winnerAddress : roundData.winner.toBase58(),
            tvl: Number(roundData.tvl)/1e9,
            finished: roundData.finished,
            claimed: roundData.claimed
          };
          let ticketLedger = await program.account.ticketList.fetch(roundData.ticketLedger);
          currentRound.ticketSold = ticketLedger.lastNumber;
          currentRound.timeRemained = parseInt(Number(roundData.startTime) + Number(roundData.roundPeriod) - Date.now()/1000);
          currentRound.timeRemained = currentRound.timeRemained >0 ? currentRound.timeRemained : 0;
          
          break;
        }
      }
    }

    console.log(currentRound)

    return currentRound
  } catch (error) {
    console.log(error)
    return {
      roundName: "0",
      totalTicket : 0,
      ticketSold : 0,
      timeRemained : 0,
      winningTicket : 0,
      tvl: 0,
      finished: true,
      claimed: true
    }
  }
}

export async function startRound(connection, wallet, roundName, totalTicket, period) {
  try {
    let provider = new anchor.AnchorProvider(connection, wallet, confirmOption)
    let program = new anchor.Program(idl, programId, provider)

    let transaction = new Transaction();

    let ticketLedger = Keypair.generate()
    let ticketLedgerSize = 8 + 36 + 40 * totalTicket;
    let lamports = await connection.getMinimumBalanceForRentExemption(ticketLedgerSize)
    console.log(lamports/1e9)
    transaction.add(anchor.web3.SystemProgram.createAccount({
      fromPubkey : wallet.publicKey,
      lamports : lamports,
      newAccountPubkey : ticketLedger.publicKey,
      programId : programId,
      space : ticketLedgerSize,
    }))

    let [roundData,bump] = await PublicKey.findProgramAddress([POOL.toBuffer(), Buffer.from(roundName)], programId)

    transaction.add (
      program.instruction.startRound(
        new anchor.BN(bump),
        roundName,
        new anchor.BN(totalTicket),
        new anchor.BN(period),
        {
          accounts: {
            owner : wallet.publicKey,
            pool : POOL,
            ticketLedger : ticketLedger.publicKey,
            roundData : roundData,
            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
            systemProgram : anchor.web3.SystemProgram.programId,
          }
        }
      )
    )

    await sendTransaction(transaction, [ticketLedger], wallet, connection);
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}

export async function withdraw(connection, wallet, amount, roundName) {
  try {
    let provider = new anchor.AnchorProvider(connection, wallet, confirmOption)
    let program = new anchor.Program(idl, programId, provider)

    let transaction = new Transaction();

    let [roundData,] = await PublicKey.findProgramAddress([POOL.toBuffer(), Buffer.from(roundName)], programId)

    transaction.add (
      program.instruction.withdraw(
        new anchor.BN(amount),
        {
          accounts: {
            owner : wallet.publicKey,
            pool : POOL,
            round : roundData,
          }
        }
      )
    )

    await sendTransaction(transaction, [], wallet, connection);
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}

export async function buyTicket(connection, wallet, roundName) {
  try {
    let provider = new anchor.AnchorProvider(connection, wallet, confirmOption)
    let program = new anchor.Program(idl, programId, provider)

    let transaction = new Transaction();
    let [round,] = await PublicKey.findProgramAddress([POOL.toBuffer(), Buffer.from(roundName)], programId)
    let poolData = await program.account.pool.fetch(POOL);
    console.log(poolData)
    let roundData = await program.account.round.fetch(round);

    console.log(roundData)
    transaction.add (
      program.instruction.buyTicket(
        {
          accounts: {
            owner : wallet.publicKey,
            pool : POOL,
            feeReceiver : poolData.feeReceiver,
            round : round,
            ticketLedger : roundData.ticketLedger,
            systemProgram : anchor.web3.SystemProgram.programId,
          }
        }
      )
    )

    await sendTransaction(transaction, [], wallet, connection);
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}

export async function claim(connection, wallet, roundName) {
  try {
    let provider = new anchor.AnchorProvider(connection, wallet, confirmOption)
    let program = new anchor.Program(idl, programId, provider)

    let transaction = new Transaction();
    let [round,] = await PublicKey.findProgramAddress([POOL.toBuffer(), Buffer.from(roundName)], programId)

    transaction.add (
      program.instruction.claim(
        {
          accounts: {
            owner : wallet.publicKey,
            pool : POOL,
            round : round,
          }
        }
      )
    )

    await sendTransaction(transaction, [], wallet, connection);
  } catch (error) {
    console.log(error)
  }
}

export async function getRoundData(connection, wallet){
	let provider = new anchor.AnchorProvider(connection,wallet,confirmOption)
	const program = new anchor.Program(idl,programId,provider)

  let [round,bump] = await PublicKey.findProgramAddress([POOL.toBuffer(), Buffer.from("1")], programId)

	let roundData = await program.account.round.fetch(round)

  console.log(roundData)
  let ticketLedger = await program.account.ticketList.fetch(roundData.ticketLedger);
  console.log(ticketLedger)
  console.log(ticketLedger.ticketLedger[1].owner.toBase58());
}