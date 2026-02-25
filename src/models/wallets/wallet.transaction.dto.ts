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