import {
  Account,
  Connection,
} from '@solana/web3.js';
import { unwrapTokens } from './unwrapToken';

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
  const result = await unwrapTokens(connection, paperWallet);
  // console.log('DONE', result);
})();
