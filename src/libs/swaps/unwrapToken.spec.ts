import {
  Account,
  Connection,
  PublicKey,
} from '@solana/web3.js';
import { unwrapToken } from './unwrapToken';
import * as bs58 from "bs58"

// CONSTANTS
const RPC_MAINNET = 'https://ssc-dao.genesysgo.net/';

// RUN
(async () => {

  // establish rpc connection
  const connection = new Connection(RPC_MAINNET, 'confirmed');
  
  // open paper wallet (privatekey retracted)
  const paperWallet = new Account();
  // console.log("Loaded ", paperWallet.publicKey.toBase58())
  // test unstake basis function
  const result = await unwrapToken(connection, paperWallet);
  // console.log('DONE', result);

})(); 