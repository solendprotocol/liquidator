import {
  ParsablePosition,
  ParsableWhirlpool,
  PositionData,
  WhirlpoolData,
} from "@orca-so/whirlpools-sdk";
import { BorshAccountsCoder, Idl, utils, web3 } from "@project-serum/anchor";
import {
  AccountLayout,
  MintLayout,
  RawAccount,
  RawMint,
} from "@solana/spl-token-v2";
import IDL from "./idl/ggoldca.json";

export class Fetcher {
  private connection: web3.Connection;
  private ggCoder: BorshAccountsCoder;
  cached: Map<string, Buffer>;

  public constructor(connection: web3.Connection) {
    this.connection = connection;
    this.cached = new Map<string, Buffer>();
    this.ggCoder = new BorshAccountsCoder(IDL as Idl);
  }

  async getAccount(
    pubkey: web3.PublicKey,
    refresh = false
  ): Promise<RawAccount> {
    const buffer = await this.getOrFetchBuffer(pubkey, refresh);
    return AccountLayout.decode(buffer);
  }

  async getMint(pubkey: web3.PublicKey, refresh = false): Promise<RawMint> {
    const buffer = await this.getOrFetchBuffer(pubkey, refresh);
    return MintLayout.decode(buffer);
  }

  // TODO use specific type
  async getVault(pubkey: web3.PublicKey, refresh = false): Promise<object> {
    const buffer = await this.getOrFetchBuffer(pubkey, refresh);
    return this.ggCoder.decode("VaultAccount", buffer);
  }

  async getWhirlpoolData(
    poolId: web3.PublicKey,
    refresh = false
  ): Promise<WhirlpoolData> {
    const buffer = await this.getOrFetchBuffer(poolId, refresh);
    const pool = ParsableWhirlpool.parse(buffer);
    if (!pool) {
      throw new Error(
        "Cannot decode " + poolId.toString() + " as WhirlpoolData"
      );
    }
    return pool;
  }

  async getWhirlpoolPositionData(
    pubkey: web3.PublicKey,
    refresh = false
  ): Promise<PositionData> {
    const buffer = await this.getOrFetchBuffer(pubkey, refresh);
    const data = ParsablePosition.parse(buffer);
    if (!data) {
      throw new Error(
        "Cannot decode " + pubkey.toString() + " as WhPositionData"
      );
    }
    return data;
  }

  async save(pubkeys: web3.PublicKey[], refresh = false) {
    if (refresh) {
      this.fetchAndSave(pubkeys);
    } else {
      const notCached = pubkeys.filter((p) => !this.cached.has(p.toString()));
      if (notCached.length) this.fetchAndSave(notCached);
    }
  }

  private async getOrFetchBuffer(
    pubkey: web3.PublicKey,
    refresh: boolean
  ): Promise<Buffer> {
    const key = pubkey.toString();
    let buffer = this.cached.get(key);
    if (refresh || !buffer) {
      await this.fetchAndSave([pubkey]);
      buffer = this.cached.get(key)!;
    }
    return buffer;
  }

  private async fetchAndSave(pubkeys: web3.PublicKey[]) {
    const accountInfos = await utils.rpc.getMultipleAccounts(
      this.connection,
      pubkeys
    );

    accountInfos.forEach((info, i) => {
      const key = pubkeys[i].toString();
      const data = info?.account.data;

      if (!data) throw new Error("Cannot fetch " + key);
      this.cached.set(key, data);
    });
  }
}
