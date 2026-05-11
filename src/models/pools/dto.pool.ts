// CREATE TABLE `pool` (
//   `pool_id` int(11) NOT NULL AUTO_INCREMENT,
//   `market_code` varchar(16) NOT NULL DEFAULT 'ETH',
//   `market_target_code` varchar(16) NOT NULL DEFAULT 'ETH',
//   `protocol` varchar(16) NOT NULL DEFAULT 'Ver 1',
//   `asset` decimal(24,10) DEFAULT NULL,
//   `amount` decimal(24,10) DEFAULT NULL,
//   `target_amount` decimal(24,10) DEFAULT NULL,
//   `fee_rate` float NOT NULL DEFAULT 0.03,
//   `reward` float DEFAULT 0.25,
//   `total_value_locked` decimal(24,10) DEFAULT 0.0000000000,
//   `annual_percentage_rate` float DEFAULT 0,
//   `is_main` bit(1) NOT NULL DEFAULT b'1',
//   `is_use` bit(1) DEFAULT b'1',
//   `created_at` timestamp NULL DEFAULT current_timestamp(),
//   `updated_at` timestamp NULL DEFAULT current_timestamp(),
//   PRIMARY KEY (`pool_id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
export interface IPool {
  pool_id: number;
  market_code: string;
  market_target_code: string;
  protocol: string;
  asset: string | null;
  amount: string | null;
  target_amount: string | null;
  fee_rate: number;
  reward: number;
  total_value_locked: string | null;
  annual_percentage_rate: number;
  is_main: boolean;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
}

// CREATE TABLE `pool_ticker` (
//   `ticker_id` int(11) NOT NULL AUTO_INCREMENT,
//   `ticker_date` date NOT NULL DEFAULT current_timestamp(),
//   `price_begin_24` decimal(24,10) NOT NULL DEFAULT 0.0000000000,
//   `price_end_24` decimal(24,10) NOT NULL DEFAULT 0.0000000000,
//   `price_max_24` decimal(24,10) NOT NULL DEFAULT 0.0000000000,
//   `price_min_24` decimal(24,10) NOT NULL DEFAULT 0.0000000000,
//   `price_volumn_24` decimal(24,10) NOT NULL DEFAULT 0.0000000000,
//   `volume_24` decimal(24,10) NOT NULL DEFAULT 0.0000000000,
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `pool_id` int(11) NOT NULL,
//   PRIMARY KEY (`ticker_id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
export interface IPoolTicker {
  ticker_id: number;
  ticker_date: Date;
  price_begin_24: string;
  price_end_24: string;
  price_max_24: string;
  price_min_24: string;
  price_volumn_24: string;
  volume_24: string;
  created_at: Date;
  updated_at: Date;
  pool_id: number;
}
