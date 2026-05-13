export enum WalletChain {
    ETHEREUM = 'ethereum',
    POLKADOT = 'polkadot',
}

export interface IWalletSignPayLoad {
    userId: number,
    name: string,
    address: string,
    mode: WalletChain,
    signature: string,
    message: string,
    provider: string
}