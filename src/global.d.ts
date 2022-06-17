export interface MarketBean {
  name: string;
  isPrimary: boolean;
  description: string;
  creator: string;
  address: string;
  authorityAddress: string;
  owner: string;
  reserves: ReserveBean[];
}

export interface ReserveBean {
  liquidityToken: LiquidityTokenBean;
  pythOracle: string;
  switchboardOracle: string;
  address: string;
  collateralMintAddress: string;
  collateralSupplyAddress: string;
  liquidityAddress: string;
  liquidityFeeReceiverAddress: string;
  userSupplyCap: number;
}

export interface LiquidityTokenBean {
  coingeckoID: string;
  decimals: number;
  logo: string;
  mint: string;
  name: string;
  symbol: string;
  volume24h: string;
}

export interface Config {
  programID: string;
  assets: Asset[];
  oracles: Oracles;
  markets: Market[];
}
export interface Asset {
  name: string;
  symbol: string;
  decimals: number;
  mintAddress: string;
}
export interface Oracles {
  pythProgramID: string;
  switchboardProgramID: string;
  assets: OracleAsset[];
}
export interface OracleAsset {
  asset: string;
  priceAddress: string;
  switchboardFeedAddress: string;
}
export interface Market {
  name: string;
  address: string;
  authorityAddress: string;
  reserves: Reserve[];
}
export interface Reserve {
  asset: string;
  address: string;
  collateralMintAddress: string;
  collateralSupplyAddress: string;
  liquidityAddress: string;
  liquidityFeeReceiverAddress: string;
  userSupplyCap?: number;
}
