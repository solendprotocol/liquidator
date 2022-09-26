export type Ggoldca = {
  "version": "0.1.0",
  "name": "ggoldca",
  "instructions": [
    {
      "name": "initializeVault",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "whirlpool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inputTokenAMintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inputTokenBMintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenAAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenBAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultLpTokenMintPubkey",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
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
          "name": "id",
          "type": "u8"
        },
        {
          "name": "fee",
          "type": "u64"
        },
        {
          "name": "minSlotsForReinvest",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setVaultPauseStatus",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "isPaused",
          "type": "bool"
        }
      ]
    },
    {
      "name": "setVaultUiStatus",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "isActive",
          "type": "bool"
        }
      ]
    },
    {
      "name": "openPosition",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpoolProgramId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "positionMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "positionTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "tickLowerIndex",
          "type": "i32"
        },
        {
          "name": "tickUpperIndex",
          "type": "i32"
        }
      ]
    },
    {
      "name": "closePosition",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpoolProgramId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "positionMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "positionTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setMarketRewards",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardsMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "destinationTokenAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "marketRewards",
          "type": {
            "defined": "MarketRewardsInfoInput"
          }
        }
      ]
    },
    {
      "name": "setVaultFee",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "fee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setMinSlotsForReinvest",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "minSlots",
          "type": "u64"
        }
      ]
    },
    {
      "name": "rebalance",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenAAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenBAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpoolProgramId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVaultA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currentPosition",
          "accounts": [
            {
              "name": "whirlpool",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "position",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "positionTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayLower",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayUpper",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "newPosition",
          "accounts": [
            {
              "name": "whirlpool",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "position",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "positionTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayLower",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayUpper",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "deposit",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultLpTokenMintPubkey",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenAAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenBAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userLpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenBAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpoolProgramId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "accounts": [
            {
              "name": "whirlpool",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "position",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "positionTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayLower",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayUpper",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "whTokenVaultA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whTokenVaultB",
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
          "name": "lpAmount",
          "type": "u64"
        },
        {
          "name": "maxAmountA",
          "type": "u64"
        },
        {
          "name": "maxAmountB",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultLpTokenMintPubkey",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenAAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenBAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userLpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenBAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpoolProgramId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "accounts": [
            {
              "name": "whirlpool",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "position",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "positionTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayLower",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayUpper",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "whTokenVaultA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whTokenVaultB",
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
          "name": "lpAmount",
          "type": "u64"
        },
        {
          "name": "minAmountA",
          "type": "u64"
        },
        {
          "name": "minAmountB",
          "type": "u64"
        }
      ]
    },
    {
      "name": "collectFees",
      "accounts": [
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenAAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenBAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryTokenAAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryTokenBAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpoolProgramId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVaultA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "position",
          "accounts": [
            {
              "name": "whirlpool",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "position",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "positionTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayLower",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayUpper",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "collectRewards",
      "accounts": [
        {
          "name": "vaultAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultRewardsTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryRewardsTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpoolProgramId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "accounts": [
            {
              "name": "whirlpool",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "position",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "positionTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayLower",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayUpper",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "rewardIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "swapRewards",
      "accounts": [
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultRewardsTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultDestinationTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "swapProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "transferRewards",
      "accounts": [
        {
          "name": "vaultAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultRewardsTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destinationTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "reinvest",
      "accounts": [
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultLpTokenMintPubkey",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whirlpoolProgramId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenAAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenBAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "position",
          "accounts": [
            {
              "name": "whirlpool",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "position",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "positionTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayLower",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayUpper",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "tickArray0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArray1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArray2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setTokenMetadata",
      "accounts": [
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultLpTokenMintPubkey",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userSigner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
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
          "name": "tokenName",
          "type": "string"
        },
        {
          "name": "tokenSymbol",
          "type": "string"
        },
        {
          "name": "tokenUri",
          "type": "string"
        },
        {
          "name": "firstTime",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "vaultAccount",
      "docs": [
        "Strategy vault account"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "Vault version"
            ],
            "type": "u8"
          },
          {
            "name": "isActiveFromUi",
            "docs": [
              "The vault is active from the UI"
            ],
            "type": "bool"
          },
          {
            "name": "isPaused",
            "docs": [
              "The smart contract is paused for this vault"
            ],
            "type": "bool"
          },
          {
            "name": "id",
            "docs": [
              "Vault number for a given whirlpool"
            ],
            "type": "u8"
          },
          {
            "name": "bumps",
            "docs": [
              "PDA bump seeds"
            ],
            "type": {
              "defined": "Bumps"
            }
          },
          {
            "name": "whirlpoolId",
            "docs": [
              "Whirlpool pubkey"
            ],
            "type": "publicKey"
          },
          {
            "name": "inputTokenAMintPubkey",
            "docs": [
              "Pool input token_a mint address"
            ],
            "type": "publicKey"
          },
          {
            "name": "inputTokenBMintPubkey",
            "docs": [
              "Pool input token_b mint address"
            ],
            "type": "publicKey"
          },
          {
            "name": "fee",
            "docs": [
              "Fee percentage using FEE_SCALE. Fee applied on earnings"
            ],
            "type": "u64"
          },
          {
            "name": "minSlotsForReinvest",
            "docs": [
              "Minimum number of elapsed slots required for reinvesting"
            ],
            "type": "u64"
          },
          {
            "name": "lastReinvestmentSlot",
            "docs": [
              "Last reinvestment slot"
            ],
            "type": "u64"
          },
          {
            "name": "lastLiquidityIncrease",
            "docs": [
              "Last reinvestment liquidity increase"
            ],
            "type": "u128"
          },
          {
            "name": "earnedRewardsTokenA",
            "docs": [
              "Total rewards earned by the vault"
            ],
            "type": "u64"
          },
          {
            "name": "earnedRewardsTokenB",
            "type": "u64"
          },
          {
            "name": "marketRewards",
            "docs": [
              "The market where to sell the rewards"
            ],
            "type": {
              "array": [
                {
                  "defined": "MarketRewardsInfo"
                },
                3
              ]
            }
          },
          {
            "name": "positions",
            "docs": [
              "Information about the opened positions (max = MAX_POSITIONS)"
            ],
            "type": {
              "vec": {
                "defined": "PositionInfo"
              }
            }
          },
          {
            "name": "padding",
            "docs": [
              "Additional padding"
            ],
            "type": {
              "array": [
                "u64",
                10
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "MarketRewardsInfoInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "docs": [
              "Id of market associated"
            ],
            "type": {
              "defined": "MarketRewards"
            }
          },
          {
            "name": "minAmountOut",
            "docs": [
              "Minimum number of lamports to receive during swap"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "Bumps",
      "docs": [
        "PDA bump seeds"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vault",
            "type": "u8"
          },
          {
            "name": "lpTokenMint",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "PositionInfo",
      "docs": [
        "Position information"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "docs": [
              "Position pubkey"
            ],
            "type": "publicKey"
          },
          {
            "name": "lowerTick",
            "docs": [
              "Position lower tick"
            ],
            "type": "i32"
          },
          {
            "name": "upperTick",
            "docs": [
              "Position upper tick"
            ],
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "MarketRewardsInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "docs": [
              "Id of market associated"
            ],
            "type": {
              "defined": "MarketRewards"
            }
          },
          {
            "name": "rewardsMint",
            "docs": [
              "Pubkey of the rewards token mint"
            ],
            "type": "publicKey"
          },
          {
            "name": "destinationTokenAccount",
            "docs": [
              "Destination account"
            ],
            "type": "publicKey"
          },
          {
            "name": "minAmountOut",
            "docs": [
              "Minimum number of lamports to receive during swap"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "MarketRewards",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NotSet"
          },
          {
            "name": "Transfer"
          },
          {
            "name": "OrcaV2"
          },
          {
            "name": "Whirlpool"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "CollectFeesEvent",
      "fields": [
        {
          "name": "vaultAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "totalFeesTokenA",
          "type": "u64",
          "index": false
        },
        {
          "name": "totalFeesTokenB",
          "type": "u64",
          "index": false
        },
        {
          "name": "treasuryFeeTokenA",
          "type": "u64",
          "index": false
        },
        {
          "name": "treasuryFeeTokenB",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "CollectRewardsEvent",
      "fields": [
        {
          "name": "vaultAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "totalRewards",
          "type": "u64",
          "index": false
        },
        {
          "name": "treasuryFee",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "DepositWithdrawEvent",
      "fields": [
        {
          "name": "vaultAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amountA",
          "type": "u64",
          "index": false
        },
        {
          "name": "amountB",
          "type": "u64",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "RebalanceEvent",
      "fields": [
        {
          "name": "vaultAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "oldLiquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "newLiquidity",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "ReinvestEvent",
      "fields": [
        {
          "name": "vaultAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "lpSupply",
          "type": "u64",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "liquidityIncrease",
          "type": "u128",
          "index": false
        },
        {
          "name": "elapsedSlots",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "SwapEvent",
      "fields": [
        {
          "name": "vaultAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "mintIn",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amountIn",
          "type": "u64",
          "index": false
        },
        {
          "name": "mintOut",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amountOut",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MathOverflowAdd",
      "msg": "Math overflow during add"
    },
    {
      "code": 6001,
      "name": "MathOverflowSub",
      "msg": "Math overflow during sub"
    },
    {
      "code": 6002,
      "name": "MathOverflowMul",
      "msg": "Math overflow during mul"
    },
    {
      "code": 6003,
      "name": "MathZeroDivision",
      "msg": "Math division by zero"
    },
    {
      "code": 6004,
      "name": "MathOverflowConversion",
      "msg": "Math overflow during type conversion"
    },
    {
      "code": 6005,
      "name": "InvalidVaultVersion",
      "msg": "Invalid vault version"
    },
    {
      "code": 6006,
      "name": "UnauthorizedUser",
      "msg": "Unauthorized user"
    },
    {
      "code": 6007,
      "name": "PausedSmartContract",
      "msg": "The smart contract is paused"
    },
    {
      "code": 6008,
      "name": "PausedVault",
      "msg": "The provided vault is paused"
    },
    {
      "code": 6009,
      "name": "NotEnoughSlots",
      "msg": "Not enough elapsed slots since last call"
    },
    {
      "code": 6010,
      "name": "InvalidFee",
      "msg": "Fee cannot exceed FEE_SCALE"
    },
    {
      "code": 6011,
      "name": "MarketInvalidDestination",
      "msg": "Market rewards input invalid destination account mint"
    },
    {
      "code": 6012,
      "name": "MarketInvalidMint",
      "msg": "Market rewards input tokens not allowed"
    },
    {
      "code": 6013,
      "name": "MarketInvalidZeroAmount",
      "msg": "Market rewards input zero min_amount_out not allowed"
    },
    {
      "code": 6014,
      "name": "ZeroLpAmount",
      "msg": "LP amount must be greater than zero"
    },
    {
      "code": 6015,
      "name": "ExceededTokenMax",
      "msg": "Exceeded token max"
    },
    {
      "code": 6016,
      "name": "InvalidDestinationAccount",
      "msg": "Invalid destination token account"
    },
    {
      "code": 6017,
      "name": "InvalidInputMint",
      "msg": "Invalid input token mint pubkey"
    },
    {
      "code": 6018,
      "name": "InvalidRewardMint",
      "msg": "Invalid reward token mint pubkey"
    },
    {
      "code": 6019,
      "name": "PositionAlreadyOpened",
      "msg": "Position already opened"
    },
    {
      "code": 6020,
      "name": "PositionLimitReached",
      "msg": "Position limit reached"
    },
    {
      "code": 6021,
      "name": "PositionNotActive",
      "msg": "Position is not active"
    },
    {
      "code": 6022,
      "name": "PositionNonExistence",
      "msg": "Position does not exist"
    },
    {
      "code": 6023,
      "name": "NotEnoughFees",
      "msg": "Not enough fees generated yet"
    },
    {
      "code": 6024,
      "name": "NotEnoughRewards",
      "msg": "Not enough rewards generated yet"
    },
    {
      "code": 6025,
      "name": "InvalidNumberOfAccounts",
      "msg": "Invalid number of accounts"
    },
    {
      "code": 6026,
      "name": "SwapNotSet",
      "msg": "Swap is not set for the current rewards"
    },
    {
      "code": 6027,
      "name": "SwapInvalidProgramId",
      "msg": "Invalid swap program ID"
    },
    {
      "code": 6028,
      "name": "TransferNotSet",
      "msg": "Transfer is not set for the current rewards"
    },
    {
      "code": 6029,
      "name": "WhirlpoolLiquidityTooHigh",
      "msg": "whirlpool_cpi: Liquidity amount must be less than i64::MAX"
    },
    {
      "code": 6030,
      "name": "WhirlpoolLiquidityToDeltasOverflow",
      "msg": "whirlpool_cpi: Overflow while computing liquidity to token deltas"
    }
  ]
};

export const IDL: Ggoldca = {
  "version": "0.1.0",
  "name": "ggoldca",
  "instructions": [
    {
      "name": "initializeVault",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "whirlpool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inputTokenAMintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inputTokenBMintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenAAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenBAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultLpTokenMintPubkey",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
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
          "name": "id",
          "type": "u8"
        },
        {
          "name": "fee",
          "type": "u64"
        },
        {
          "name": "minSlotsForReinvest",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setVaultPauseStatus",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "isPaused",
          "type": "bool"
        }
      ]
    },
    {
      "name": "setVaultUiStatus",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "isActive",
          "type": "bool"
        }
      ]
    },
    {
      "name": "openPosition",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpoolProgramId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "positionMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "positionTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "tickLowerIndex",
          "type": "i32"
        },
        {
          "name": "tickUpperIndex",
          "type": "i32"
        }
      ]
    },
    {
      "name": "closePosition",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpoolProgramId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "positionMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "positionTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setMarketRewards",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardsMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "destinationTokenAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "marketRewards",
          "type": {
            "defined": "MarketRewardsInfoInput"
          }
        }
      ]
    },
    {
      "name": "setVaultFee",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "fee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setMinSlotsForReinvest",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "minSlots",
          "type": "u64"
        }
      ]
    },
    {
      "name": "rebalance",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenAAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenBAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpoolProgramId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVaultA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currentPosition",
          "accounts": [
            {
              "name": "whirlpool",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "position",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "positionTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayLower",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayUpper",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "newPosition",
          "accounts": [
            {
              "name": "whirlpool",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "position",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "positionTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayLower",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayUpper",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "deposit",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultLpTokenMintPubkey",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenAAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenBAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userLpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenBAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpoolProgramId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "accounts": [
            {
              "name": "whirlpool",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "position",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "positionTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayLower",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayUpper",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "whTokenVaultA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whTokenVaultB",
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
          "name": "lpAmount",
          "type": "u64"
        },
        {
          "name": "maxAmountA",
          "type": "u64"
        },
        {
          "name": "maxAmountB",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "userSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultLpTokenMintPubkey",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenAAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenBAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userLpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenBAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpoolProgramId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "accounts": [
            {
              "name": "whirlpool",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "position",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "positionTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayLower",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayUpper",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "whTokenVaultA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whTokenVaultB",
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
          "name": "lpAmount",
          "type": "u64"
        },
        {
          "name": "minAmountA",
          "type": "u64"
        },
        {
          "name": "minAmountB",
          "type": "u64"
        }
      ]
    },
    {
      "name": "collectFees",
      "accounts": [
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenAAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenBAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryTokenAAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryTokenBAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpoolProgramId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVaultA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "position",
          "accounts": [
            {
              "name": "whirlpool",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "position",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "positionTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayLower",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayUpper",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "collectRewards",
      "accounts": [
        {
          "name": "vaultAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultRewardsTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryRewardsTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpoolProgramId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "accounts": [
            {
              "name": "whirlpool",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "position",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "positionTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayLower",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayUpper",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "rewardIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "swapRewards",
      "accounts": [
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultRewardsTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultDestinationTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "swapProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "transferRewards",
      "accounts": [
        {
          "name": "vaultAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultRewardsTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destinationTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "reinvest",
      "accounts": [
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultLpTokenMintPubkey",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whirlpoolProgramId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenAAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultInputTokenBAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "position",
          "accounts": [
            {
              "name": "whirlpool",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "position",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "positionTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayLower",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "tickArrayUpper",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "tickArray0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArray1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArray2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setTokenMetadata",
      "accounts": [
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultLpTokenMintPubkey",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userSigner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
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
          "name": "tokenName",
          "type": "string"
        },
        {
          "name": "tokenSymbol",
          "type": "string"
        },
        {
          "name": "tokenUri",
          "type": "string"
        },
        {
          "name": "firstTime",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "vaultAccount",
      "docs": [
        "Strategy vault account"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "Vault version"
            ],
            "type": "u8"
          },
          {
            "name": "isActiveFromUi",
            "docs": [
              "The vault is active from the UI"
            ],
            "type": "bool"
          },
          {
            "name": "isPaused",
            "docs": [
              "The smart contract is paused for this vault"
            ],
            "type": "bool"
          },
          {
            "name": "id",
            "docs": [
              "Vault number for a given whirlpool"
            ],
            "type": "u8"
          },
          {
            "name": "bumps",
            "docs": [
              "PDA bump seeds"
            ],
            "type": {
              "defined": "Bumps"
            }
          },
          {
            "name": "whirlpoolId",
            "docs": [
              "Whirlpool pubkey"
            ],
            "type": "publicKey"
          },
          {
            "name": "inputTokenAMintPubkey",
            "docs": [
              "Pool input token_a mint address"
            ],
            "type": "publicKey"
          },
          {
            "name": "inputTokenBMintPubkey",
            "docs": [
              "Pool input token_b mint address"
            ],
            "type": "publicKey"
          },
          {
            "name": "fee",
            "docs": [
              "Fee percentage using FEE_SCALE. Fee applied on earnings"
            ],
            "type": "u64"
          },
          {
            "name": "minSlotsForReinvest",
            "docs": [
              "Minimum number of elapsed slots required for reinvesting"
            ],
            "type": "u64"
          },
          {
            "name": "lastReinvestmentSlot",
            "docs": [
              "Last reinvestment slot"
            ],
            "type": "u64"
          },
          {
            "name": "lastLiquidityIncrease",
            "docs": [
              "Last reinvestment liquidity increase"
            ],
            "type": "u128"
          },
          {
            "name": "earnedRewardsTokenA",
            "docs": [
              "Total rewards earned by the vault"
            ],
            "type": "u64"
          },
          {
            "name": "earnedRewardsTokenB",
            "type": "u64"
          },
          {
            "name": "marketRewards",
            "docs": [
              "The market where to sell the rewards"
            ],
            "type": {
              "array": [
                {
                  "defined": "MarketRewardsInfo"
                },
                3
              ]
            }
          },
          {
            "name": "positions",
            "docs": [
              "Information about the opened positions (max = MAX_POSITIONS)"
            ],
            "type": {
              "vec": {
                "defined": "PositionInfo"
              }
            }
          },
          {
            "name": "padding",
            "docs": [
              "Additional padding"
            ],
            "type": {
              "array": [
                "u64",
                10
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "MarketRewardsInfoInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "docs": [
              "Id of market associated"
            ],
            "type": {
              "defined": "MarketRewards"
            }
          },
          {
            "name": "minAmountOut",
            "docs": [
              "Minimum number of lamports to receive during swap"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "Bumps",
      "docs": [
        "PDA bump seeds"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vault",
            "type": "u8"
          },
          {
            "name": "lpTokenMint",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "PositionInfo",
      "docs": [
        "Position information"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "docs": [
              "Position pubkey"
            ],
            "type": "publicKey"
          },
          {
            "name": "lowerTick",
            "docs": [
              "Position lower tick"
            ],
            "type": "i32"
          },
          {
            "name": "upperTick",
            "docs": [
              "Position upper tick"
            ],
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "MarketRewardsInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "docs": [
              "Id of market associated"
            ],
            "type": {
              "defined": "MarketRewards"
            }
          },
          {
            "name": "rewardsMint",
            "docs": [
              "Pubkey of the rewards token mint"
            ],
            "type": "publicKey"
          },
          {
            "name": "destinationTokenAccount",
            "docs": [
              "Destination account"
            ],
            "type": "publicKey"
          },
          {
            "name": "minAmountOut",
            "docs": [
              "Minimum number of lamports to receive during swap"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "MarketRewards",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NotSet"
          },
          {
            "name": "Transfer"
          },
          {
            "name": "OrcaV2"
          },
          {
            "name": "Whirlpool"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "CollectFeesEvent",
      "fields": [
        {
          "name": "vaultAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "totalFeesTokenA",
          "type": "u64",
          "index": false
        },
        {
          "name": "totalFeesTokenB",
          "type": "u64",
          "index": false
        },
        {
          "name": "treasuryFeeTokenA",
          "type": "u64",
          "index": false
        },
        {
          "name": "treasuryFeeTokenB",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "CollectRewardsEvent",
      "fields": [
        {
          "name": "vaultAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "totalRewards",
          "type": "u64",
          "index": false
        },
        {
          "name": "treasuryFee",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "DepositWithdrawEvent",
      "fields": [
        {
          "name": "vaultAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amountA",
          "type": "u64",
          "index": false
        },
        {
          "name": "amountB",
          "type": "u64",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "RebalanceEvent",
      "fields": [
        {
          "name": "vaultAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "oldLiquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "newLiquidity",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "ReinvestEvent",
      "fields": [
        {
          "name": "vaultAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "lpSupply",
          "type": "u64",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "liquidityIncrease",
          "type": "u128",
          "index": false
        },
        {
          "name": "elapsedSlots",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "SwapEvent",
      "fields": [
        {
          "name": "vaultAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "mintIn",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amountIn",
          "type": "u64",
          "index": false
        },
        {
          "name": "mintOut",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amountOut",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MathOverflowAdd",
      "msg": "Math overflow during add"
    },
    {
      "code": 6001,
      "name": "MathOverflowSub",
      "msg": "Math overflow during sub"
    },
    {
      "code": 6002,
      "name": "MathOverflowMul",
      "msg": "Math overflow during mul"
    },
    {
      "code": 6003,
      "name": "MathZeroDivision",
      "msg": "Math division by zero"
    },
    {
      "code": 6004,
      "name": "MathOverflowConversion",
      "msg": "Math overflow during type conversion"
    },
    {
      "code": 6005,
      "name": "InvalidVaultVersion",
      "msg": "Invalid vault version"
    },
    {
      "code": 6006,
      "name": "UnauthorizedUser",
      "msg": "Unauthorized user"
    },
    {
      "code": 6007,
      "name": "PausedSmartContract",
      "msg": "The smart contract is paused"
    },
    {
      "code": 6008,
      "name": "PausedVault",
      "msg": "The provided vault is paused"
    },
    {
      "code": 6009,
      "name": "NotEnoughSlots",
      "msg": "Not enough elapsed slots since last call"
    },
    {
      "code": 6010,
      "name": "InvalidFee",
      "msg": "Fee cannot exceed FEE_SCALE"
    },
    {
      "code": 6011,
      "name": "MarketInvalidDestination",
      "msg": "Market rewards input invalid destination account mint"
    },
    {
      "code": 6012,
      "name": "MarketInvalidMint",
      "msg": "Market rewards input tokens not allowed"
    },
    {
      "code": 6013,
      "name": "MarketInvalidZeroAmount",
      "msg": "Market rewards input zero min_amount_out not allowed"
    },
    {
      "code": 6014,
      "name": "ZeroLpAmount",
      "msg": "LP amount must be greater than zero"
    },
    {
      "code": 6015,
      "name": "ExceededTokenMax",
      "msg": "Exceeded token max"
    },
    {
      "code": 6016,
      "name": "InvalidDestinationAccount",
      "msg": "Invalid destination token account"
    },
    {
      "code": 6017,
      "name": "InvalidInputMint",
      "msg": "Invalid input token mint pubkey"
    },
    {
      "code": 6018,
      "name": "InvalidRewardMint",
      "msg": "Invalid reward token mint pubkey"
    },
    {
      "code": 6019,
      "name": "PositionAlreadyOpened",
      "msg": "Position already opened"
    },
    {
      "code": 6020,
      "name": "PositionLimitReached",
      "msg": "Position limit reached"
    },
    {
      "code": 6021,
      "name": "PositionNotActive",
      "msg": "Position is not active"
    },
    {
      "code": 6022,
      "name": "PositionNonExistence",
      "msg": "Position does not exist"
    },
    {
      "code": 6023,
      "name": "NotEnoughFees",
      "msg": "Not enough fees generated yet"
    },
    {
      "code": 6024,
      "name": "NotEnoughRewards",
      "msg": "Not enough rewards generated yet"
    },
    {
      "code": 6025,
      "name": "InvalidNumberOfAccounts",
      "msg": "Invalid number of accounts"
    },
    {
      "code": 6026,
      "name": "SwapNotSet",
      "msg": "Swap is not set for the current rewards"
    },
    {
      "code": 6027,
      "name": "SwapInvalidProgramId",
      "msg": "Invalid swap program ID"
    },
    {
      "code": 6028,
      "name": "TransferNotSet",
      "msg": "Transfer is not set for the current rewards"
    },
    {
      "code": 6029,
      "name": "WhirlpoolLiquidityTooHigh",
      "msg": "whirlpool_cpi: Liquidity amount must be less than i64::MAX"
    },
    {
      "code": 6030,
      "name": "WhirlpoolLiquidityToDeltasOverflow",
      "msg": "whirlpool_cpi: Overflow while computing liquidity to token deltas"
    }
  ]
};
