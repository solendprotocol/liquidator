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
import { getWalletBalance } from 'libs/utils';
import { MINT_BASIS, MINT_RBASIS, unstakeBasisInstruction } from 'models/instructions/basis/unstake';

export const checkAndUnwrapBasisTokens = async (connection: Connection, payer: Account) => {
  const rBasisPubKey = new PublicKey(MINT_RBASIS);
  // check if wallet has rBasis tokens
  const tokenAmount = await getWalletBalance(connection, rBasisPubKey, payer.publicKey);
  if (tokenAmount) {
    await unstakeBasis(connection, payer, rBasisPubKey, tokenAmount);
  }
};

export const unstakeBasis = async (
  connection: Connection,
  payer: Account,
  mint: PublicKey,
  amount: number,
) => {
  console.log(`unstaking ${amount} rBasis`);
  const ixs: TransactionInstruction[] = [];
  // get associated token account for rBasis
  const rBasisAccount = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(mint),
    payer.publicKey,
  );

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

  // compose full unstake instruction
  const unstakeBasisIx = unstakeBasisInstruction(
    amount, // NOTE: full unstake
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
  console.log(`successfully unstaked ${amount} rBasis: ${txHash}`);
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
