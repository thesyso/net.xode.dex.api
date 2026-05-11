// CREATE TABLE `master` (
//   `master_id` int(11) NOT NULL AUTO_INCREMENT,
//   `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0 : 가입 , 1 : 일반 , 7 : 정지, 9 : 탈퇴',
//   `authority` tinyint(4) NOT NULL DEFAULT 0,
//   `emailid` varchar(64) NOT NULL,
//   `password` varchar(512) DEFAULT NULL,
//   `salt` varchar(32) NOT NULL DEFAULT 'XMASTER2025',
//   `email` varchar(64) NOT NULL,
//   `mastername` varchar(32) DEFAULT NULL,
//   `nickname` varchar(32) NOT NULL,
//   `nation_no` varchar(4) DEFAULT NULL,
//   `phone` varchar(16) DEFAULT NULL,
//   `nation` varchar(32) DEFAULT NULL,
//   `location` varchar(16) DEFAULT NULL,
//   `language` varchar(16) DEFAULT NULL,
//   `address` varchar(256) DEFAULT NULL,
//   `address_detail` varchar(256) DEFAULT NULL,
//   `zipcode` varchar(8) DEFAULT NULL,
//   `connected_ip` varchar(32) DEFAULT NULL,
//   `connected_at` timestamp NULL DEFAULT NULL,
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   PRIMARY KEY (`master_id`),
//   UNIQUE KEY `master_emailid_key` (`emailid`)
// ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
export interface IMaster {
  master_id: number;
  status: number;
  authority: number;
  emailid: string;
  password: string | null;
  salt: string;
  email: string;
  mastername: string | null;
  nickname: string;
  nation_no: string | null;
  phone: string | null;
  nation: string | null;
  location: string | null;
  language: string | null;
  address: string | null;
  address_detail: string | null;
  zipcode: string | null;
  connected_ip: string | null;
  connected_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

// CREATE TABLE `master_connect` (
//   `connect_id` int(11) NOT NULL AUTO_INCREMENT,
//   `memo` varchar(4000) DEFAULT NULL,
//   `connected_ip` varchar(32) DEFAULT NULL,
//   `connected_at` timestamp NULL DEFAULT NULL,
//   `master_id` int(11) NOT NULL,
//   PRIMARY KEY (`connect_id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='connection info';
export interface IMasterConnect {
  connect_id: number;
  memo: string | null;
  connected_ip: string | null;
  connected_at: Date | null;
  master_id: number;
}

// CREATE TABLE `master_secure` (
//   `secure_id` int(11) NOT NULL AUTO_INCREMENT,
//   `class` varchar(16) NOT NULL DEFAULT 'email',
//   `secure_code` varchar(16) NOT NULL,
//   `is_commit` bit(1) NOT NULL DEFAULT b'0',
//   `is_use` bit(1) NOT NULL DEFAULT b'1',
//   `limited_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `master_id` int(11) NOT NULL,
//   PRIMARY KEY (`secure_id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
export interface IMasterSecure {
  secure_id: number;
  class: string;
  secure_code: string;
  is_commit: boolean;
  is_use: boolean;
  limited_at: Date;
  created_at: Date;
  updated_at: Date;
  master_id: number;
}