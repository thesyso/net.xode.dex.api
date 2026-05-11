// CREATE TABLE `market` (
//   `market_code` varchar(16) NOT NULL DEFAULT 'ETH',
//   `market_name` varchar(32) DEFAULT NULL,
//   `price_begin_24` decimal(24,10) NOT NULL DEFAULT 0.0000000000,
//   `price_end_24` decimal(24,10) NOT NULL DEFAULT 0.0000000000,
//   `price_max_24` decimal(24,10) NOT NULL DEFAULT 0.0000000000,
//   `price_min_24` decimal(24,10) NOT NULL DEFAULT 0.0000000000,
//   `price_volumn_24` decimal(24,10) NOT NULL DEFAULT 0.0000000000,
//   `volumn_24` decimal(24,10) NOT NULL DEFAULT 0.0000000000,
//   `gas` decimal(24,10) DEFAULT NULL,
//   `is_use` bit(1) NOT NULL DEFAULT b'1',
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   PRIMARY KEY (`market_code`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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

// CREATE TABLE `market_i18n` (
//   `market_i18n_id` int(11) NOT NULL AUTO_INCREMENT,
//   `language_name` varchar(32) NOT NULL DEFAULT 'English',
//   `is_use` bit(1) NOT NULL DEFAULT b'1',
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `market_code` varchar(16) NOT NULL DEFAULT 'ETH',
//   `language_code` varchar(4) NOT NULL DEFAULT 'en',
//   PRIMARY KEY (`market_i18n_id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
export interface IMarketI18n {
  market_i18n_id: number;
  language_name: string;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
  market_code: string;
  language_code: string;
}

// CREATE TABLE `market_ticker` (
//   `market_ticker_id` int(11) NOT NULL AUTO_INCREMENT,
//   `workdated` date NOT NULL DEFAULT current_timestamp(),
//   `price_begin_24` decimal(24,10) NOT NULL,
//   `price_end_24` decimal(24,10) NOT NULL,
//   `price_max_24` decimal(24,10) NOT NULL,
//   `price_min_24` decimal(24,10) NOT NULL,
//   `price_volume_24` decimal(24,10) NOT NULL,
//   `volume_24` decimal(24,10) NOT NULL,
//   `is_use` bit(1) NOT NULL DEFAULT b'1',
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `updated_at` timestamp NOT NULL,
//   `market_code` varchar(16) NOT NULL,
//   `exchange_code` varchar(16) NOT NULL,
//   PRIMARY KEY (`market_ticker_id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
export interface IMarketTicker {
  market_ticker_id: number;
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
  market_code: string;
  exchange_code: string;
}

// CREATE TABLE `market_chart` (
//   `exchange_code` varchar(16) NOT NULL,
//   `market_code` varchar(16) NOT NULL,
//   `work_at` timestamp NOT NULL,
//   `price_open` decimal(36,18) NOT NULL DEFAULT 0.000000000000000000,
//   `price_high` decimal(36,18) NOT NULL DEFAULT 0.000000000000000000,
//   `price_low` decimal(36,18) NOT NULL DEFAULT 0.000000000000000000,
//   `privce_volumn` decimal(36,18) NOT NULL DEFAULT 0.000000000000000000,
//   `asset_volumn` decimal(36,18) NOT NULL DEFAULT 0.000000000000000000,
//   `created_at` timestamp NOT NULL,
//   PRIMARY KEY (`exchange_code`,`market_code`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

export interface IMarketChart {
  exchange_code: string;
  market_code: string;
  work_at: Date;
  price_open: string;
  price_high: string;
  price_low: string;
  privce_volumn: string;
  asset_volumn: string;
  created_at: Date;
}
