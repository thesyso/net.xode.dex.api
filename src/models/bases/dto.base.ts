// CREATE TABLE `base_coin` (
//   `coin_code` varchar(16) NOT NULL COMMENT '고유번호',
//   `coin_name` varchar(32) NOT NULL,
//   `digit` tinyint(4) NOT NULL DEFAULT 8 COMMENT 'BTC : 8, ETH : 18, USDT : 6',
//   `fee` float NOT NULL DEFAULT 0 COMMENT 'sat/vB, Gwei .. Lamport, Drop...',
//   `is_use` bit(1) NOT NULL DEFAULT b'1',
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT '등록일',
//   `updated_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT '수정일',
//   PRIMARY KEY (`coin_code`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
export interface IBaseCoin {
  coin_code: string;
  coin_name: string;
  digit: number;
  fee: number;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
}

// CREATE TABLE `base_exchange` (
//   `exchange_code` varchar(16) NOT NULL DEFAULT 'binance',
//   `exchange_name` varchar(32) NOT NULL DEFAULT 'binance',
//   `is_use` bit(1) NOT NULL DEFAULT b'1',
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   PRIMARY KEY (`exchange_code`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
export interface IBaseExchange {
  exchange_code: string;
  exchange_name: string;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
}

// CREATE TABLE `base_language` (
//   `language_code` varchar(4) NOT NULL DEFAULT 'en',
//   `language_name` varchar(32) NOT NULL DEFAULT 'English',
//   `is_use` bit(1) NOT NULL DEFAULT b'1',
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   PRIMARY KEY (`language_code`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
export interface IBaseLanguage {
  language_code: string;
  language_name: string;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
}