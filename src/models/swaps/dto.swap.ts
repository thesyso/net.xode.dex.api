export interface ISwap {
  swap_id: number;
  swap_action: number;
  swap_status: number;
  swap_price: number;
  swap_volumn: number;
  swap_fee: number;
  swap_txid: string | null;
  market_code: string;
  market_price: number | null;
  wallet_id: number | null;
  address: string;
  address_meno: string | null;
  target_market_code: string;
  target_market_price: number | null;
  target_wallet_id: number | null;
  target_address: string;
  target_address_memo: string | null;
  is_open: boolean;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
  pool_id: number;
}