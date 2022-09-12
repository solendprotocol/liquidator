import { Account, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { unwrapNazareLp, getNazareTokenMints } from "./nazare-nlp/unwrapNazareLp";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

export const findAssociatedTokenAddress = async (
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
) => {
  return (
    await PublicKey.findProgramAddress(
      [walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMintAddress.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0]
}

export const getWalletBalance = async (
  connection: Connection,
  mint: PublicKey,
  walletAddress: PublicKey
): Promise<number> => {
  const userAta = await findAssociatedTokenAddress(walletAddress, mint)

  return await connection
    .getTokenAccountBalance(userAta)
    .then((tokenAmount) => {
      if (parseFloat(tokenAmount?.value?.amount)) {
        return parseFloat(tokenAmount.value.amount)
      } else {
        return 0
      }
    })
    .catch((error) => {
      return 0
    })
}

export const unwrapToken = async (
  connection: Connection,
  payer: Account,
) => {
  // Nazare LP tokens 
  const nazareMints = await getNazareTokenMints(connection)
  for (const mint of nazareMints) {
    // check if wallet has Nazare LP tokens
    const tokenAmount = await getWalletBalance(connection, mint, payer.publicKey)
    if (tokenAmount) {
      unwrapNazareLp(connection, payer, mint, tokenAmount)
    }
  } 
}