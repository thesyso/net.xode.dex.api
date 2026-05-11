/**
CREATE TABLE `transaction` (
  `transaction_id` int(11) NOT NULL AUTO_INCREMENT,
  `mode` char(1) NOT NULL DEFAULT 'P',
  `mainnet` varchar(16) NOT NULL DEFAULT 'xode',
  `txid` varchar(512) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1 : processing, 3 : failed, 8 : rollback, 9 : completed',
  `market_code` varchar(16) NOT NULL,
  `market_target_code` varchar(16) NOT NULL,
  `amount` decimal(24,10) NOT NULL DEFAULT 0.0000000000,
  `amount_target` decimal(24,10) DEFAULT NULL,
  `fee` decimal(24,10) NOT NULL DEFAULT 0.0000000000,
  `fee_rate` float NOT NULL DEFAULT 0.3,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `pool_id` int(11) NOT NULL,
  `swap_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`transaction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
 */
export interface dtoTransaction {
  transaction_id: number;
  mode: string;
  mainnet: string;
  txid: string;
  status: number;
  market_code: string;
  market_target_code: string;
  amount: string;
  amount_target: string | null;
  fee: string;
  fee_rate: number;
  created_at: Date;
  pool_id: number;
  swap_id: number | null;
}                   