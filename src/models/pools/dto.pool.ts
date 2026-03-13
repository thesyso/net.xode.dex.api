export interface IPool {
  pool_id: number;
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

export interface IPoolTicker {
  ticker_id: number;
  ticker_date: Date;
  price_begin_24: string;
  price_end_24: string;
  price_max_24: string;
  price_min_24: string;
  price_volume_24: string;
  volume_24: string;
  created_at: Date;
  updated_at: Date;
  pool_id: number;
}
