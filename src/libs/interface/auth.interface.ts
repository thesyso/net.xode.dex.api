import { EnumWalletChain } from "./wallet.interface.js";
export interface ISignPayLoad {
  uid: string;
  id: string;
  role: string;
  deviceId: string;
  deviceIp: string;
  connected_ip: string;
  connected_at: Date;
}

export interface IAuth extends ISignPayLoad {
  accessToken: string;
  refreshToken: string;
}

export interface IResVerify extends ISignPayLoad {
  ok: boolean;
  message: string;
  mode?: "access" | "refresh";
}

export interface IWalletSignPayLoad {
  walletId: number;
  userWalletId: number;
  deviceId: string;
  deviceIp: string;
  address: string;
  chain: EnumWalletChain;
  signature: string;
  walletName: string;
  provider: string;
}

export interface IWalletAuth extends IWalletSignPayLoad {
  accessToken: string;
  refreshToken: string;
}

export interface IResVerifyWallet extends IWalletSignPayLoad {
  ok: boolean;
  message: string;
  mode?: "access" | "refresh";
}
