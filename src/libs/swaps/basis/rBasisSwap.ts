import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
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
import * as Layout from 'libs/layout';
import { StakingInstruction } from './instruction';

// mints & keys
// NOTE: did not use the usual getTokenInfo pattern as not sure how useful
// an abstract redemption is as staking contracts aren't universal
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
    BufferLayout.u8('instruction'),
    Layout.uint64('amount'),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: StakingInstruction.unstake,
      amount: new BN(amount),
    },
    data,
  );

  const keys = [
    { pubkey: userAuthority, isSigner: true, isWritable: false },
    { pubkey: userToken, isSigner: false, isWritable: true },
    { pubkey: userRedeemable, isSigner: false, isWritable: true },
    { pubkey: new PublicKey(MINT_RBASIS), isSigner: false, isWritable: true },
    { pubkey: new PublicKey(MINT_BASIS), isSigner: false, isWritable: false },
    { pubkey: new PublicKey(PROGRAM_BASIS_STAKING_INSTANCE), isSigner: false, isWritable: false },
    { pubkey: new PublicKey(PROGRAM_BASIS_STAKING_INSTANCE), isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: new PublicKey(PROGRAM_BASIS_STAKING),
    data,
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

  // get associated token account for rBasis
  const rBasisAccount = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(MINT_RBASIS),
    payer.publicKey,
  );
  const rBasisAccountInfo = await connection.getAccountInfo(rBasisAccount);
  if (!rBasisAccountInfo) throw new Error('this function requires active rBasis associated token account');

  // compose full unstake instruction
  const unstakeBasisIx = unstakeBasisInstruction(
    rBasisAccountInfo.lamports, // NOTE: full unstake
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
