// CREATE TABLE `participant` (
//   `participant_id` int(11) NOT NULL AUTO_INCREMENT,
//   `market_code` varchar(16) DEFAULT NULL,
//   `market_target_code` varchar(16) DEFAULT NULL,
//   `status` tinyint(4) DEFAULT NULL COMMENT '1 : request, 2 : processing, 3 : failed, 5 : save, 7 : withdrawal, 9 : completed',
//   `asset` decimal(24,10) DEFAULT NULL,
//   `amount` decimal(24,10) DEFAULT NULL,
//   `target_amount` decimal(24,10) DEFAULT NULL,
//   `start_date` date DEFAULT NULL,
//   `end_date` date DEFAULT NULL,
//   `fee` decimal(24,10) NOT NULL DEFAULT 0.0000000000,
//   `fee_rate` float NOT NULL DEFAULT 0.03,
//   `withdraw_fee` decimal(24,10) NOT NULL DEFAULT 0.0000000000,
//   `withdraw_target_fee` decimal(24,10) NOT NULL DEFAULT 0.0000000000,
//   `is_open` bit(1) NOT NULL DEFAULT b'1',
//   `is_use` bit(1) NOT NULL DEFAULT b'1',
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `pool_id` int(11) NOT NULL,
//   PRIMARY KEY (`participant_id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
export interface IParticipant {
  participant_id: number;
  market_code: string | null;
  market_target_code: string | null;
  status: number | null;
  asset: string | null;
  amount: string | null;
  target_amount: string | null;
  start_date: Date | null;
  end_date: Date | null;
  fee: string;
  fee_rate: number;
  withdraw_fee: string;
  withdraw_target_fee: string;
  is_open: boolean;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
  pool_id: number;
}

// CREATE TABLE `participant_deposit` (
//   `participant_deposit_id` int(11) NOT NULL AUTO_INCREMENT,
//   `market_code` varchar(16) DEFAULT NULL,
//   `status` tinyint(4) DEFAULT NULL,
//   `fee` decimal(24,10) DEFAULT NULL,
//   `fee_rate` float DEFAULT NULL,
//   `is_open` bit(1) NOT NULL DEFAULT b'1',
//   `is_use` bit(1) NOT NULL DEFAULT b'1',
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `swap_id` int(11) NOT NULL,
//   `participant_id` int(11) NOT NULL,
//   PRIMARY KEY (`participant_deposit_id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
export interface IParticipantDeposit {
  participant_deposit_id: number;
  market_code: string | null;
  status: number | null;
  fee: string | null;
  fee_rate: number | null;
  is_open: boolean;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
  swap_id: number;
  participant_id: number;
}