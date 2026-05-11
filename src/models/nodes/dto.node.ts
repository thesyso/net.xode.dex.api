import { fromTwos } from "ethers";

export interface IDXAssets {
  id: string;
  assetNode: string;
  assetId: string;
  decimal: number;
  name: string;
  owner: string;
  symbol: string;
  updatedAt: Date;
}

export interface IDXBlock {
  id: string;
  blockHash: string;
  blockNumber: number;
  rawData: {
    block: any,
    events: any[];
  };
  summary: {
    txCount: number;
    isFinalized: boolean;
  };
  timestamp: Date;
  transactions: IDXTransaction[];
}

export interface IDXTransaction {
  id: string;
  hash: string;
  amount: string;
  assetCode: string;
  assetId: Number;
  blockNumber: Number;
  fee: string;
  from: string;
  method: string;
  module: string;
  success: boolean;
  timestamp: Date;
  tip: string;
  to: string;
}
