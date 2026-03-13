export interface dtoTransaction {
  transaction_id: number;
  mode: string;
  tx_id: string;
  status: number;
  market_code: string;
  market_target_code: string;
  amount: number;
  amount_target: number;
  fee: number;
  fee_target: number;
  created_at: Date;
  pool_id: number;
  swap_id: number | null;
}                   