/* eslint-disable prefer-promise-reject-errors */
import { Jupiter } from '@jup-ag/core';
import {
  Connection, Keypair, PublicKey,
} from '@solana/web3.js';

const SLIPPAGE = 2;
const SWAP_TIMEOUT_SEC = 20;

export default async function swap(connection: Connection, wallet: Keypair, jupiter: Jupiter, fromTokenInfo, toTokenInfo, amount: number) {
  console.log({
    fromToken: fromTokenInfo.symbol,
    toToken: toTokenInfo.symbol,
    amount: amount.toString(),
  }, 'swapping tokens');

  const inputMint = new PublicKey(fromTokenInfo.mintAddress);
  const outputMint = new PublicKey(toTokenInfo.mintAddress);
  const routes = await jupiter.computeRoutes({
    inputMint, // Mint address of the input token
    outputMint, // Mint address of the output token
    inputAmount: amount, // raw input amount of tokens
    slippage: SLIPPAGE, // The slippage in % terms
  });

  // Prepare execute exchange
  const { execute } = await jupiter.exchange({
    routeInfo: routes.routesInfos[0],
  });

  // Execute swap
  await new Promise((resolve, reject) => {
    // sometime jup hangs hence the timeout here.
    let timedOut = false;
    const timeoutHandle = setTimeout(() => {
      timedOut = true;
      console.error(`Swap took longer than ${SWAP_TIMEOUT_SEC} seconds to complete.`);
      reject('Swap timed out');
    }, SWAP_TIMEOUT_SEC * 1000);

    execute().then((swapResult: any) => {
      if (!timedOut) {
        clearTimeout(timeoutHandle);

        console.log({
          tx: swapResult.txid,
          inputAddress: swapResult.inputAddress.toString(),
          outputAddress: swapResult.outputAddress.toString(),
          inputAmount: swapResult.inputAmount / fromTokenInfo.decimals,
          outputAmount: swapResult.outputAmount / toTokenInfo.decimals,
          inputToken: fromTokenInfo.symbol,
          outputToken: toTokenInfo.symbol,
        }, 'successfully swapped token');
        resolve(swapResult);
      }
    }).catch((swapError) => {
      if (!timedOut) {
        clearTimeout(timeoutHandle);
        console.error({
          err: swapError.error,
          tx: swapError.txid,
          fromToken: fromTokenInfo.symbol,
          toToken: toTokenInfo.symbol,
        }, 'error swapping');
        resolve(swapError);
      }
    });
  });
}
