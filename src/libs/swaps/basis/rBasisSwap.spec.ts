/* eslint-disable no-restricted-imports */

// DEPENDENCIES
import {
  Account,
  Connection,
} from '@solana/web3.js';
import { readFile, stat } from 'fs/promises';
import { unstakeBasis } from './rBasisSwap';

// CONSTANTS
const RPC_MAINNET = 'https://ssc-dao.genesysgo.net/';

// RUN
(async () => {
  const connection = new Connection(RPC_MAINNET, 'confirmed');
  
  // open paper wallet
  const walletPath = process.argv[2];
  if (!walletPath) throw new Error('provide valid paper wallet path');
  const walletPathExists = await stat(walletPath);
  if (!walletPathExists || walletPathExists.size <= 0) throw new Error('provide valid paper wallet path');
  const paperWallet = new Account(JSON.parse((await readFile(walletPath)).toString()));
  console.log('LOADED', paperWallet.publicKey.toBase58());

  // unstake basis
  const result = await unstakeBasis(connection, paperWallet);
  console.log(result);

})();
