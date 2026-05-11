
// CREATE TABLE `board` (
//   `board_id` int(11) NOT NULL AUTO_INCREMENT,
//   `cago` varchar(16) NOT NULL DEFAULT 'default',
//   `depth` tinyint(4) NOT NULL DEFAULT 0,
//   `status` tinyint(4) NOT NULL DEFAULT 0,
//   `writer` varchar(32) NOT NULL,
//   `subject` varchar(256) NOT NULL,
//   `contents` varchar(4000) DEFAULT NULL,
//   `hits` smallint(6) NOT NULL DEFAULT 0,
//   `favorite` smallint(6) NOT NULL DEFAULT 0,
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `user_id` int(11) DEFAULT NULL,
//   `wallet_id` int(11) NOT NULL,
//   PRIMARY KEY (`board_id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
export interface IBoard {
  board_id: number;
  cago: string;
  depth: number;
  status: number;
  writer: string;
  subject: string;
  contents: string | null;
  hits: number;
  favorite: number;
  created_at: Date;
  updated_at: Date;
  user_id: number | null;
  wallet_id: number;
}

// CREATE TABLE `board_favorite` (
//   `favorite_id` int(11) NOT NULL AUTO_INCREMENT,
//   `is_use` bit(1) DEFAULT b'1',
//   `created_at` timestamp NULL DEFAULT current_timestamp(),
//   `user_id` int(11) DEFAULT NULL,
//   `wallet_id` int(11) NOT NULL,
//   `board_id` int(11) NOT NULL,
//   PRIMARY KEY (`favorite_id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
export interface IBoardFavorite {
  favorite_id: number;
  is_use: boolean;
  created_at: Date;
  user_id: number | null;
  wallet_id: number;
  board_id: number;
}

// CREATE TABLE `board_file` (
//   `file_id` int(11) NOT NULL AUTO_INCREMENT,
//   `sort` tinyint(4) NOT NULL DEFAULT 0,
//   `file_name` varchar(512) NOT NULL,
//   `origin_name` varchar(512) NOT NULL,
//   `is_use` bit(1) NOT NULL DEFAULT b'1',
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `board_id` int(11) NOT NULL,
//   PRIMARY KEY (`file_id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
export interface IBoardFile {
  file_id: number;
  sort: number;
  file_name: string;
  origin_name: string;
  is_use: boolean;
  created_at: Date;
  board_id: number;
}

// CREATE TABLE `board_hit` (
//   `hits_id` int(11) NOT NULL AUTO_INCREMENT,
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `user_id` int(11) DEFAULT NULL,
//   `wallet_id` int(11) NOT NULL,
//   `board_id` int(11) NOT NULL,
//   PRIMARY KEY (`hits_id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
export interface IBoardHit {
  hits_id: number;
  created_at: Date;
  user_id: number | null;
  wallet_id: number;
  board_id: number;
}

// CREATE TABLE `board_image` (
//   `image_id` int(11) NOT NULL AUTO_INCREMENT,
//   `sort` tinyint(4) NOT NULL DEFAULT 0,
//   `image_name` varchar(512) NOT NULL,
//   `origin_name` varchar(512) NOT NULL,
//   `is_use` bit(1) NOT NULL DEFAULT b'1',
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `board_id` int(11) NOT NULL,
//   PRIMARY KEY (`image_id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
export interface IBoardImage {
  image_id: number;
  sort: number;
  image_name: string;
  origin_name: string;
  is_use: boolean;
  created_at: Date;
  board_id: number;
}

