import { Account, Connection } from '@solana/web3.js';
import { checkAndUnwrapBasisTokens } from './basis/rBasisSwap';
import { checkAndUnwrapNLPTokens } from './nazare/unwrapNazareLp';
import { checkAndUnwrapKaminoTokens } from './kamino/unwrapKamino';

export const unwrapTokens = async (
  connection: Connection,
  payer: Account,
) => {
  await checkAndUnwrapBasisTokens(connection, payer);
  await checkAndUnwrapNLPTokens(connection, payer);
  await checkAndUnwrapKaminoTokens(connection, payer);
};
