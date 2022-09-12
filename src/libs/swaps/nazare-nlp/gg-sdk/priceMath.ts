import * as wh from "@orca-so/whirlpools-sdk";
import { BN } from "@project-serum/anchor";
import { u64 } from "@solana/spl-token";
import { Fetcher } from "./fetcher";
import { PDAAccounts, VaultId } from "./pda";

export class PriceMath {
  fetcher: Fetcher;
  pdaAccounts: PDAAccounts;

  public constructor(fetcher: Fetcher, pdaAccounts: PDAAccounts) {
    this.fetcher = fetcher;
    this.pdaAccounts = pdaAccounts;
  }

  async getLpFromTokenAmounts(
    vaultId: VaultId,
    tokenAmountA: BN,
    tokenAmountB: BN
  ): Promise<BN> {
    const position = await this.pdaAccounts.getActivePosition(vaultId);
    const [poolData, positionData] = await Promise.all([
      this.fetcher.getWhirlpoolData(vaultId.whirlpool, true),
      this.fetcher.getWhirlpoolPositionData(position, true),
    ]);

    const tokenAmounts = wh.toTokenAmount(
      tokenAmountA.toNumber(),
      tokenAmountB.toNumber()
    );

    return wh.PoolUtil.estimateLiquidityFromTokenAmounts(
      poolData.tickCurrentIndex,
      positionData.tickLowerIndex,
      positionData.tickUpperIndex,
      tokenAmounts
    );
  }

  async getTokenAmountsFromLp(
    vaultId: VaultId,
    lpAmount: BN
  ): Promise<[BN, BN]> {
    const position = await this.pdaAccounts.getActivePosition(vaultId);
    const [poolData, positionData] = await Promise.all([
      this.fetcher.getWhirlpoolData(vaultId.whirlpool, true),
      this.fetcher.getWhirlpoolPositionData(position, true),
    ]);

    const currentPrice = wh.PriceMath.tickIndexToSqrtPriceX64(
      poolData.tickCurrentIndex
    );
    const lowerPrice = wh.PriceMath.tickIndexToSqrtPriceX64(
      positionData.tickLowerIndex
    );
    const upperPrice = wh.PriceMath.tickIndexToSqrtPriceX64(
      positionData.tickUpperIndex
    );

    const amounts = wh.PoolUtil.getTokenAmountsFromLiquidity(
      new u64(lpAmount.toString()),
      currentPrice,
      lowerPrice,
      upperPrice,
      false
    );

    return [
      new BN(amounts.tokenA.toString()),
      new BN(amounts.tokenB.toString()),
    ];
  }
}
