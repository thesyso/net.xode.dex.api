
// CREATE TABLE `asset` (
//   `asset_id` varchar(16) NOT NULL,
//   `asset_node` varchar(8) NOT NULL DEFAULT 'XODE',
//   `asset_status` tinyint(4) NOT NULL DEFAULT 1,
//   `asset_decimal` smallint(6) NOT NULL DEFAULT 8,
//   `asset_name` varchar(32) NOT NULL,
//   `asset_symbol` varchar(8) NOT NULL,
//   `is_use` bit(1) NOT NULL DEFAULT b'1',
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   PRIMARY KEY (`asset_id`,`asset_node`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='asset info';

export interface IAsset {
  asset_id: string;
  asset_node: string;
  asset_status: number;
  asset_decimal: number;
  asset_name: string;
  asset_symbol: string;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
}

