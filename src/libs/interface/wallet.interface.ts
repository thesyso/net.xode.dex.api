export enum EnumWalletChain {
    ETHEREUM = 'ethereum',
    POLKADOT = 'polkadot',
}

export interface IWalletSignPayLoad {
    walletId: number,
    userWalletId: number,
    deviceId: string,
    deviceIp: string,
    address: string,
    chain: EnumWalletChain,
    signature: string,
    walletName: string,
    provider: string
}

export interface IWalletAuth extends IWalletSignPayLoad {
    accessToken: string,
    refreshToken: string
}

export interface IResVerifyWallet extends IWalletSignPayLoad {
    ok: boolean,
    message: string,
    mode?: "access" | "refresh"
}