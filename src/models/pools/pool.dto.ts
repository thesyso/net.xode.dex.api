export interface IPool {
  pool_uid: number;
  market_code: string;
  market_target_code: string;
  protocol: string;
  asset: number | null;
  amount: number | null;
  target_amount: number | null;
  fee_rate: number;
  total_value_locked: number;
  annual_percentage_rate: number;
  is_main: boolean;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
  reward: number;
}