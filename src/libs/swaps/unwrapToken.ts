/* eslint-disable no-restricted-syntax */
import { Account, Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { unwrapNazareLp, getNazareTokenMints } from './nazare-nlp/unwrapNazareLp';

export const findAssociatedTokenAddress = async (
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey,
) => (
  await PublicKey.findProgramAddress(
    [walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMintAddress.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID,
  )
)[0];

export const getWalletBalance = async (
  connection: Connection,
  mint: PublicKey,
  walletAddress: PublicKey,
): Promise<number> => {
  const userAta = await findAssociatedTokenAddress(walletAddress, mint);

  return connection
    .getTokenAccountBalance(userAta)
    .then((tokenAmount) => {
      if (parseFloat(tokenAmount?.value?.amount)) {
        return parseFloat(tokenAmount.value.amount);
      }
      return 0;
    })
    .catch((error) => 0);
};

export const unwrapToken = async (
  connection: Connection,
  payer: Account,
) => {
  // Nazare LP tokens 
  const nazareMints = await getNazareTokenMints(connection);
  for (const mint of nazareMints) {
    // check if wallet has Nazare LP tokens
    const tokenAmount = await getWalletBalance(connection, mint, payer.publicKey);
    if (tokenAmount) {
      await unwrapNazareLp(connection, payer, mint, tokenAmount);
    }
  }
};
