/**
CREATE TABLE `soboard` (
  `soboard_id` int(11) NOT NULL AUTO_INCREMENT,
  `cago` varchar(16) NOT NULL DEFAULT 'default',
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `writer` varchar(32) NOT NULL,
  `subject` varchar(256) NOT NULL,
  `contents` varchar(4000) DEFAULT NULL,
  `contents_count` tinyint(4) NOT NULL DEFAULT 1,
  `hits` smallint(6) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL,
  `wallet_id` int(11) NOT NULL,
  PRIMARY KEY (`soboard_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 */
export interface ISoBoard {
  soboard_id: number;
  cago: string; // 0 : delete, 1 : normal, 2 : padding, 3 : block
  status: number;
  writer: string;
  subject: string;
  contents: string | null;
  contents_count: number;
  hits: number;
  created_at: Date;
  updated_at: Date;
  user_id: number | null;
  wallet_id: number;
}

/**
CREATE TABLE `soboard_content` (
  `content_id` int(11) NOT NULL AUTO_INCREMENT,
  `sort` tinyint(4) NOT NULL DEFAULT 0,
  `contents` varchar(4000) NOT NULL,
  `is_use` bit(1) NOT NULL DEFAULT b'1',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `soboard_id` int(11) NOT NULL,
  PRIMARY KEY (`content_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 */
export interface ISoBoardContent {
  content_id: number;
  sort: number;
  contents: string;
  is_use: boolean;
  created_at: Date;
  soboard_id: number;
}

/**
CREATE TABLE `soboard_favorite` (
  `favorite_id` int(11) NOT NULL AUTO_INCREMENT,
  `is_use` bit(1) NOT NULL DEFAULT b'1',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL,
  `wallet_id` int(11) NOT NULL,
  `soboard_id` int(11) NOT NULL,
  PRIMARY KEY (`favorite_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 */
export interface ISoBoardFavorite {
  favorite_id: number;
  is_use: boolean;
  created_at: Date;
  user_id: number | null;
  wallet_id: number;
  soboard_id: number;
}

/**
CREATE TABLE `soboard_file` (
  `file_id` int(11) NOT NULL AUTO_INCREMENT,
  `sort` tinyint(4) NOT NULL DEFAULT 0,
  `file_name` varchar(512) NOT NULL,
  `origin_name` varchar(512) NOT NULL,
  `is_use` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `soboard_id` int(11) NOT NULL,
  PRIMARY KEY (`file_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 */
export interface ISoBoardFile {
  file_id: number;
  sort: number;
  file_name: string;
  origin_name: string;
  is_use: boolean;
  created_at: Date;
  soboard_id: number;
}

/**
CREATE TABLE `soboard_hit` (
  `hit_id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL,
  `wallet_id` int(11) NOT NULL,
  `soboard_id` int(11) NOT NULL,
  PRIMARY KEY (`hit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
*/
export interface ISoBoardHit {
  hit_id: number;
  created_at: Date;
  user_id: number | null;
  wallet_id: number;
  soboard_id: number;
}

/**
CREATE TABLE `soboard_image` (
  `image_id` int(11) NOT NULL AUTO_INCREMENT,
  `sort` tinyint(4) NOT NULL DEFAULT 0,
  `image_name` varchar(512) NOT NULL,
  `origin_name` varchar(512) NOT NULL,
  `is_use` bit(1) NOT NULL DEFAULT b'1',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `soboard_id` int(11) NOT NULL,
  PRIMARY KEY (`image_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 */
export interface ISoBoardImage {
  image_id: number;
  sort: number;
  image_name: string;
  origin_name: string;
  is_use: boolean;
  created_at: Date;
  soboard_id: number;
}