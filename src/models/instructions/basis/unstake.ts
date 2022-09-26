import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import BN from 'bn.js';
import * as BufferLayout from 'buffer-layout';
import { sha256 } from 'js-sha256';
import * as Layout from 'libs/layout';
import { snakeCase } from 'snake-case';
import { StakingInstruction, StakingInstructionNames } from './instruction';

// NOTE: LIFTED FROM ANCHOR
export function sighash(nameSpace: string, ixName: string): Buffer {
  const name = snakeCase(ixName);
  const preimage = `${nameSpace}:${name}`;
  return Buffer.from(sha256.digest(preimage)).slice(0, 8);
}

// CONSTANTS
// NOTE: did not use the usual getTokenInfo pattern as not sure how useful
// an abstract redemption is as staking contracts aren't universal
const SIGHASH_GLOBAL_NAMESPACE = 'global';
export const MINT_BASIS = 'Basis9oJw9j8cw53oMV7iqsgo6ihi9ALw4QR31rcjUJa';
export const MINT_RBASIS = 'rBsH9ME52axhqSjAVXY3t1xcCrmntVNvP3X16pRjVdM';
export const PROGRAM_BASIS_STAKING = 'FTH1V7jAETZfDgHiL4hJudKXtV8tqKN1WEnkyY4kNAAC';
export const PROGRAM_BASIS_STAKING_INSTANCE = 'HXCJ1tWowNNNUSrtoVnxT3y9ue1tkuaLNbFMM239zm1y';
export const PROGRAM_BASIS_STAKING_VAULT = '3sBX8hj4URsiBCSRV26fEHkake295fQnM44EYKKsSs51';

export const unstakeBasisInstruction = (
  amount: number | BN | string,
  userAuthority: PublicKey,
  userToken: PublicKey,
  userRedeemable: PublicKey,
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([
    Layout.uint64('amount'),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      amount: new BN(amount),
    },
    data,
  );

  // userAuthority    M[ ] S[x]
  // userToken        M[x] S[ ]
  // userRedeemable   M[x] S[ ]
  // redeemableMint   M[x] S[ ]
  // tokenMint        M[ ] S[ ]
  // stakingAccount   M[ ] S[ ]
  // tokenVault       M[x] S[ ]
  // tokenProgram     M[ ] S[ ]

  const keys = [
    { pubkey: userAuthority, isSigner: true, isWritable: false },
    { pubkey: userToken, isSigner: false, isWritable: true },
    { pubkey: userRedeemable, isSigner: false, isWritable: true },
    { pubkey: new PublicKey(MINT_RBASIS), isSigner: false, isWritable: true },
    { pubkey: new PublicKey(MINT_BASIS), isSigner: false, isWritable: false },
    { pubkey: new PublicKey(PROGRAM_BASIS_STAKING_INSTANCE), isSigner: false, isWritable: false },
    { pubkey: new PublicKey(PROGRAM_BASIS_STAKING_VAULT), isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: new PublicKey(PROGRAM_BASIS_STAKING),
    data: Buffer.concat([sighash(SIGHASH_GLOBAL_NAMESPACE, StakingInstructionNames[StakingInstruction.unstake]), data]),
  });
};
