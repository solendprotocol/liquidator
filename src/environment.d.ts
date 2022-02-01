// declare global env variable to define types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      THROTTLE: number,
      WALLET_PATH: string,
      APP: string,
      MARKET: string,
    }
  }
}

export { };
