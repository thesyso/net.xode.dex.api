export interface IBaseExchange {
  exchange_code: string;
  exchange_name: string;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IBaseLanguage {
  language_code: string;
  language_name: string;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
}