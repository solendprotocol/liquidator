/* eslint-disable no-restricted-syntax,no-continue */
import { Account, Connection, sendAndConfirmTransaction } from '@solana/web3.js';
import {
  assignBlockInfoToTransaction, createTransactionWithExtraBudget, getAssociatedTokenAddressAndData, Kamino,
} from '@hubbleprotocol/kamino-sdk';
import { getConfigByCluster } from '@hubbleprotocol/hubble-config';

const cluster = process.env.APP === 'production' ? 'mainnet-beta' : 'devnet';

export const checkAndUnwrapKaminoTokens = async (
  connection: Connection,
  payer: Account,
) => {
  const kamino = new Kamino(cluster, connection);
  const config = getConfigByCluster(cluster);
  for (const strategyPubkey of config.kamino.strategies) {
    const strategy = await kamino.getStrategyByAddress(strategyPubkey);
    if (!strategy) {
      console.error('Could not fetch strategy from the chain');
      continue;
    }
    const strategyWithAddress = { strategy, address: strategyPubkey };

    const withdrawInstruction = await kamino.withdrawAllShares(strategyWithAddress, payer.publicKey);
    // if withdraw instruction is null, then token balance is 0 and cant withdraw anything, skip that
    if (withdrawInstruction) {
      const [sharesAta, sharesMintData] = await getAssociatedTokenAddressAndData(connection, strategy.sharesMint, payer.publicKey);
      const [tokenAAta, tokenAData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenAMint, payer.publicKey);
      const [tokenBAta, tokenBData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenBMint, payer.publicKey);

      // create a transaction that has an instruction for extra compute budget (withdraw operation needs this),
      let tx = createTransactionWithExtraBudget(payer.publicKey);

      const ataInstructions = await kamino.getCreateAssociatedTokenAccountInstructionsIfNotExist(
        payer.publicKey,
        strategyWithAddress,
        tokenAData,
        tokenAAta,
        tokenBData,
        tokenBAta,
        sharesMintData,
        sharesAta,
      );
      if (ataInstructions.length > 0) {
        tx.add(...ataInstructions);
      }

      tx.add(withdrawInstruction);

      tx = await assignBlockInfoToTransaction(connection, tx, payer.publicKey);

      const txHash = await sendAndConfirmTransaction(connection, tx, [payer], {
        commitment: 'confirmed',
      });

      console.log(`successfully withdrew Kamino shares from strategy (${strategyPubkey.toString()}): ${txHash}`);
    }
  }
};
