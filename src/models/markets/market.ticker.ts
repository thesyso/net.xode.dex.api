export interface IMarketTicker {
  market_code: string;
  exchange: string;
  workdated: Date;
  price_begin_24: string;
  price_end_24: string;
  price_max_24: string;
  price_min_24: string;
  price_volume_24: string;
  volume_24: string;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
}