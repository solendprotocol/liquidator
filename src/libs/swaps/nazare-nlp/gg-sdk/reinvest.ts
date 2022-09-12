import { PoolUtil, PriceMath } from "@orca-so/whirlpools-sdk";
import { BN } from "@project-serum/anchor";
import { Decimal } from "decimal.js";

export function isSwapAtoB(
  sqrtPrice: BN,
  liquidity: BN,
  tickLowerIndex: number,
  tickUpperIndex: number,
  vaultAmountA: bigint,
  vaultAmountB: bigint
): boolean {
  const priceLower = PriceMath.tickIndexToSqrtPriceX64(tickLowerIndex);
  const priceUpper = PriceMath.tickIndexToSqrtPriceX64(tickUpperIndex);

  const { tokenA, tokenB } = PoolUtil.getTokenAmountsFromLiquidity(
    liquidity,
    sqrtPrice,
    priceLower,
    priceUpper,
    false
  );

  const amountA = new Decimal(vaultAmountA.toString());
  const amountB = new Decimal(vaultAmountB.toString());
  const decimalA = new Decimal(tokenA.toString());
  const decimalB = new Decimal(tokenB.toString());

  const ratio = decimalA.div(decimalB);

  return amountA.gt(ratio.mul(amountB));
}
