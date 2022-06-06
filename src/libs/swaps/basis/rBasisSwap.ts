/* eslint-disable new-cap */
/* eslint-disable no-restricted-imports */
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
  AccountLayout,
  u64,
} from '@solana/spl-token';
import {
  Transaction,
  Account,
  Connection,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js';
import BN from 'bn.js';
import * as BufferLayout from 'buffer-layout';
import { snakeCase } from 'snake-case';
import { sha256 } from 'js-sha256';
import * as Layout from '../../layout';
import { StakingInstruction, StakingInstructionNames } from './instruction';

// CONSTANTS
// NOTE: did not use the usual getTokenInfo pattern as not sure how useful
// an abstract redemption is as staking contracts aren't universal
const SIGHASH_GLOBAL_NAMESPACE = 'global';
export const MINT_BASIS = 'Basis9oJw9j8cw53oMV7iqsgo6ihi9ALw4QR31rcjUJa';
export const MINT_RBASIS = 'rBsH9ME52axhqSjAVXY3t1xcCrmntVNvP3X16pRjVdM';
export const PROGRAM_BASIS_STAKING = 'FTH1V7jAETZfDgHiL4hJudKXtV8tqKN1WEnkyY4kNAAC';
export const PROGRAM_BASIS_STAKING_INSTANCE = 'HXCJ1tWowNNNUSrtoVnxT3y9ue1tkuaLNbFMM239zm1y';
export const PROGRAM_BASIS_STAKING_VAULT = '3sBX8hj4URsiBCSRV26fEHkake295fQnM44EYKKsSs51';

// NOTE: LIFTED FROM ANCHOR
export function sighash(nameSpace: string, ixName: string): Buffer {
  const name = snakeCase(ixName);
  const preimage = `${nameSpace}:${name}`;
  return Buffer.from(sha256.digest(preimage)).slice(0, 8);
}

function parseTokenAccountData(account, data) {
  const accountInfo = AccountLayout.decode(data);
  accountInfo.address = account;
  accountInfo.mint = new PublicKey(accountInfo.mint);
  accountInfo.owner = new PublicKey(accountInfo.owner);
  accountInfo.amount = u64.fromBuffer(accountInfo.amount);

  if (accountInfo.delegateOption === 0) {
    accountInfo.delegate = null;
    accountInfo.delegatedAmount = new u64(0);
  } else {
    accountInfo.delegate = new PublicKey(accountInfo.delegate);
    accountInfo.delegatedAmount = u64.fromBuffer(accountInfo.delegatedAmount);
  }

  accountInfo.isInitialized = accountInfo.state !== 0;
  accountInfo.isFrozen = accountInfo.state === 2;

  if (accountInfo.isNativeOption === 1) {
    accountInfo.rentExemptReserve = u64.fromBuffer(accountInfo.isNative);
    accountInfo.isNative = true;
  } else {
    accountInfo.rentExemptReserve = null;
    accountInfo.isNative = false;
  }

  if (accountInfo.closeAuthorityOption === 0) {
    accountInfo.closeAuthority = null;
  } else {
    accountInfo.closeAuthority = new PublicKey(accountInfo.closeAuthority);
  }

  return accountInfo;
}

export async function getTokenAccount(connection, publicKey) {
  const result = await connection.getAccountInfo(publicKey);
  if (!result) return false;
  const data = Buffer.from(result.data);
  const account = parseTokenAccountData(publicKey, data);
  return {
    publicKey,
    account,
  };
}

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

export const unstakeBasis = async (
  connection: Connection,
  payer: Account,
) => {
  const ixs: TransactionInstruction[] = [];

  // get associated token account for Basis (or create if doens't exist)
  const BasisAccount = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(MINT_BASIS),
    payer.publicKey,
  );
  const BasisAccountInfo = await connection.getAccountInfo(BasisAccount);
  if (!BasisAccountInfo) {
    const createBasisAtaIx = Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      new PublicKey(MINT_BASIS),
      BasisAccount,
      payer.publicKey,
      payer.publicKey,
    );
    ixs.push(createBasisAtaIx);
  }
  // DEBUG
  // console.log('BASIS ACCOUNT', BasisAccount.toBase58());

  // get associated token account for rBasis
  const rBasisAccount = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(MINT_RBASIS),
    payer.publicKey,
  );
  const rBasisAccountInfo = await connection.getAccountInfo(rBasisAccount);
  const rBasisTokenAccount = await getTokenAccount(connection, rBasisAccount);
  if (!rBasisAccountInfo || !rBasisTokenAccount) throw new Error('this function requires active rBasis associated token account');
  const rBasisAmount = rBasisTokenAccount.account.amount.toNumber();
  // DEBUG
  // console.log('rBASIS ACCOUNT', rBasisAccount.toBase58(), rBasisTokenAccount.account.amount.toNumber());
  if (!rBasisAmount || rBasisAmount === 0) throw new Error('insufficient rBasis present in account');

  // compose full unstake instruction
  const unstakeBasisIx = unstakeBasisInstruction(
    rBasisTokenAccount.account.amount, // NOTE: full unstake
    payer.publicKey,
    BasisAccount,
    rBasisAccount,
  );
  ixs.push(unstakeBasisIx);

  const tx = new Transaction().add(...ixs);
  const { blockhash } = await connection.getRecentBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = payer.publicKey;
  tx.sign(payer);

  const txHash = await connection.sendRawTransaction(tx.serialize(), { skipPreflight: false });
  await connection.confirmTransaction(txHash, 'processed');
  return txHash;
};

/*
NOTE: IDL
{
  "version": "0.1.0",
  "name": "basis_staking",
  "instructions": [
    {
      "name": "initialise",
      "accounts": [
        {
          "name": "stakingAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "redeemableMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "stakingName",
          "type": "string"
        },
        {
          "name": "bumps",
          "type": {
            "defined": "StakingBumps"
          }
        },
        {
          "name": "stakingTimes",
          "type": {
            "defined": "StakingTimes"
          }
        }
      ]
    },
    {
      "name": "reclaimMintAuthority",
      "accounts": [
        {
          "name": "stakingAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "redeemableMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "stakingName",
          "type": "string"
        },
        {
          "name": "bumps",
          "type": {
            "defined": "StakingBumps"
          }
        }
      ]
    },
    {
      "name": "stake",
      "accounts": [
        {
          "name": "userAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userRedeemable",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "redeemableMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakingAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "unstake",
      "accounts": [
        {
          "name": "userAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userRedeemable",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "redeemableMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakingAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "emitPrice",
      "accounts": [
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "redeemableMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "StakingAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakingAuthority",
            "type": "publicKey"
          },
          {
            "name": "stakingName",
            "type": {
              "array": [
                "u8",
                12
              ]
            }
          },
          {
            "name": "stakingTimes",
            "type": {
              "defined": "StakingTimes"
            }
          },
          {
            "name": "bumps",
            "type": {
              "defined": "StakingBumps"
            }
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "redeemableMint",
            "type": "publicKey"
          },
          {
            "name": "tokenVault",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "StakingTimes",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startStaking",
            "type": "i64"
          },
          {
            "name": "endGracePeriod",
            "type": "i64"
          },
          {
            "name": "endStaking",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "StakingBumps",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakingAccount",
            "type": "u8"
          },
          {
            "name": "tokenVault",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "PriceChange",
      "fields": [
        {
          "name": "oldTokenPerRedeemableE6",
          "type": "u64",
          "index": false
        },
        {
          "name": "oldTokenPerRedeemable",
          "type": "string",
          "index": false
        },
        {
          "name": "newTokenPerRedeemableE6",
          "type": "u64",
          "index": false
        },
        {
          "name": "newTokenPerRedeemable",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "Price",
      "fields": [
        {
          "name": "tokenPerRedeemableE6",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenPerRedeemable",
          "type": "string",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "StakingFuture",
      "msg": "Staking must start in the future"
    },
    {
      "code": 6001,
      "name": "SequentialTimes",
      "msg": "Staking times are non-sequential"
    },
    {
      "code": 6002,
      "name": "StartStakingTime",
      "msg": "Staking has not started"
    },
    {
      "code": 6003,
      "name": "GracePeriodTime",
      "msg": "Within the grace period"
    },
    {
      "code": 6004,
      "name": "EndStakingTime",
      "msg": "Staking has ended"
    },
    {
      "code": 6005,
      "name": "StakingNotOver",
      "msg": "Staking has not finished yet"
    },
    {
      "code": 6006,
      "name": "LowUserTokens",
      "msg": "User holds insufficient tokens"
    },
    {
      "code": 6007,
      "name": "LowUserRedeemable",
      "msg": "User holds insufficient redeemable tokens"
    }
  ],
  "metadata": {
    "address": "FTH1V7jAETZfDgHiL4hJudKXtV8tqKN1WEnkyY4kNAAC"
  }
}
*/
