/**
CREATE TABLE `wallet` (
  `wallet_id` int(11) NOT NULL AUTO_INCREMENT,
  `wallet_class` varchar(16) NOT NULL COMMENT 'METAMASK, SUBWALLET, NOVAWALLET, UNISWAP...',
  `wallet_mode` varchar(16) NOT NULL COMMENT 'W3, CEX, DEX, HW, ETC',
  `wallet_name` varchar(32) NOT NULL COMMENT 'default',
  `mainnet` varchar(16) NOT NULL,
  `coin_code` varchar(16) NOT NULL,
  `address` varchar(256) NOT NULL,
  `address_memo` varchar(128) DEFAULT NULL,
  `is_main` bit(1) NOT NULL DEFAULT b'1',
  `is_use` bit(1) NOT NULL DEFAULT b'1',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `parent_wallet_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`wallet_id`),
  KEY `wallet_address_IDX` (`address`,`address_memo`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 */
export interface IWallet {
  wallet_id: number;
  wallet_class: string;
  wallet_mode: string;
  wallet_name: string;
  mainnet: string;
  coin_code: string;
  address: string;
  address_memo: string | null;
  is_main: boolean;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
  parent_wallet_id: number | null;
}

/**
CREATE TABLE `wallet_transaction` (
  `transaction_id` int(11) NOT NULL AUTO_INCREMENT,
  `mainnet` varchar(16) NOT NULL DEFAULT 'ethereum',
  `asset_code` varchar(16) NOT NULL DEFAULT 'XON',
  `scan_hash` varchar(512) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0 : pending, 1 : success & mined, 2 : failure & failed, 3 : reverted, 4 : droped,  5 : replaced',
  `block` int(11) NOT NULL,
  `confirm_block` tinyint(4) DEFAULT NULL,
  `wallet_from` varchar(256) DEFAULT NULL,
  `wallet_from_memo` varchar(128) DEFAULT NULL,
  `wallet_to` varchar(256) DEFAULT NULL,
  `wallet_to_memo` varchar(128) DEFAULT NULL,
  `amount_fee` varchar(64) NOT NULL DEFAULT '0',
  `amount_gas` varchar(64) NOT NULL DEFAULT '0',
  `amount_value` varchar(64) NOT NULL DEFAULT '0',
  `confirm_at` datetime(3) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `wallet_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `wallet_transaction_scan_hash_idx` (`scan_hash`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=348 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 */
export interface IWalletTransaction {
  transaction_id: number;
  mainnet: string;
  asset_code: string;
  scan_hash: string;
  status: number;
  block: number;
  confirm_block: number | null;
  wallet_from: string | null;
  wallet_from_memo: string | null;
  wallet_to: string | null;
  wallet_to_memo: string | null;
  amount_fee: string;
  amount_gas: string;
  amount_value: string;
  confirm_at: Date | null;
  created_at: Date;
  updated_at: Date;
  wallet_id: number | null;
}