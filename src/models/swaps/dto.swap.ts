/**
CREATE TABLE `swap` (
  `swap_id` int(11) NOT NULL AUTO_INCREMENT,
  `swap_action` tinyint(4) NOT NULL DEFAULT 1,
  `swap_status` tinyint(4) NOT NULL DEFAULT 1,
  `swap_price` decimal(24,10) NOT NULL,
  `swap_volumn` decimal(24,10) NOT NULL,
  `swap_fee` decimal(24,10) NOT NULL,
  `swap_txid` varchar(512) DEFAULT NULL,
  `market_code` varchar(16) NOT NULL,
  `market_price` decimal(24,10) DEFAULT NULL,
  `wallet_id` int(11) DEFAULT NULL,
  `address` varchar(256) NOT NULL,
  `address_meno` varchar(128) DEFAULT NULL,
  `target_market_code` varchar(16) NOT NULL,
  `target_market_price` decimal(24,10) DEFAULT NULL,
  `target_wallet_id` int(11) DEFAULT NULL,
  `target_address` varchar(256) NOT NULL,
  `target_address_memo` varchar(128) DEFAULT NULL,
  `is_open` bit(1) NOT NULL DEFAULT b'1',
  `is_use` bit(1) NOT NULL DEFAULT b'1',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `pool_id` int(11) NOT NULL,
  PRIMARY KEY (`swap_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 */
export interface ISwap {
  swap_id: number;
  swap_action: number;
  swap_status: number;
  swap_price: string;
  swap_volumn: string;
  swap_fee: string;
  swap_txid: string | null;
  market_code: string;
  market_price: string | null;
  wallet_id: number | null;
  address: string;
  address_meno: string | null;
  target_market_code: string;
  target_market_price: string | null;
  target_wallet_id: number | null;
  target_address: string;
  target_address_memo: string | null;
  is_open: boolean;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
  pool_id: number;
}