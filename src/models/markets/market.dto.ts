export interface IMarket {
  market_code: string;
  market_name: string | null;
  price_begin_24: string;
  price_end_24: string;
  price_max_24: string;
  price_min_24: string;
  price_volumn_24: string;
  volumn_24: string;
  gas: string | null;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
}