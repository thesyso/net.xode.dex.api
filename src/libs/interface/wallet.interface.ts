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

export interface IResVerifyWallet {
    ok: boolean,
    message: string,
    mode?: string,
    address?: string | null,
    chain?: string | null,
    deviceId?: string | null,
    deviceIp?: string | null
}