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

export interface IWalletTransaction {
  scan_hash: string;
  wallet_uid: number;
  status: number;
  block: number;
  confirm_block: number | null;
  wallet_from: string | null;
  wallet_from_memo: string | null;
  wallet_to: string | null;
  wallet_to_memo: string | null;
  amount_fee: number;
  amount_gas: number;
  amount_value: number;
  confirm_at: Date | null;
  created_at: Date;
  updated_at: Date;
}