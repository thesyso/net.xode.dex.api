export interface IUser {
  user_id: number;
  address: string;
  chain: string;
  message: string;
  signature: string;
  wallet_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface IUserWallet {
  user_wallet_id: number;
  mainnet: string;
  coin_code: string;
  address: string;
  address_memo: string;
  signature: string;
  created_at: Date;
  updated_at: Date;
  wallet_id: number;
  user_id: number;
}