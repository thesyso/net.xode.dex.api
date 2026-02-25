export interface IWallet {
  wallet_uid: number;
  wallet_class: string;
  wallet_mode: string;
  wallet_name: string;
  mainnet: string;
  market_code: string;
  address: string;
  address_memo: string;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
}