/**
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `wallet_address` varchar(256) NOT NULL,
  `wallet_message` varchar(256) NOT NULL,
  `signature` varchar(256) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `wallet_mode` varchar(100) NOT NULL,
  `wallet_name` varchar(32) NOT NULL,
  `wallet_provider` varchar(100) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 0,
  `emailid` varchar(64) DEFAULT NULL,
  `password` varchar(512) DEFAULT NULL,
  `salt` varchar(32) DEFAULT NULL,
  `email` varchar(64) DEFAULT NULL,
  `username` varchar(32) DEFAULT NULL,
  `nickname` varchar(32) DEFAULT NULL,
  `nation_no` varchar(32) DEFAULT NULL,
  `location` varchar(16) DEFAULT NULL,
  `language` varchar(16) DEFAULT NULL,
  `user_address` varchar(256) DEFAULT NULL,
  `address_detail` varchar(256) DEFAULT NULL,
  `zipcode` varchar(8) DEFAULT NULL,
  `is_confirm` bit(1) DEFAULT b'0',
  `is_real` bit(1) DEFAULT b'0',
  `is_otp` bit(1) DEFAULT b'0',
  `connected_ip` varchar(32) DEFAULT NULL,
  `connected_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_address_key` (`wallet_address`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 */
export interface IUser {
  user_id: number;
  wallet_address: string;
  wallet_message: string;
  signature: string;
  created_at: Date;
  updated_at: Date;
  wallet_mode: string;
  wallet_name: string;
  wallet_provider: string | null;
  status: number; // 0 : 가입,1 : 일반, 5 : 인증회원, 7 : 정지회원, 9 : 탈퇴회원
  emailid: string | null;
  password: string | null;
  salt: string | null;
  email: string | null;
  username: string | null;
  nickname: string | null;
  nation_no: string | null;
  location: string | null;
  language: string | null;
  user_address: string | null;
  address_detail: string | null;
  zipcode: string | null;
  is_confirm: boolean;
  is_real: boolean;
  is_otp: boolean;
  connected_ip: string | null;
  connected_at: Date;
}

/**
CREATE TABLE `user_wallet` (
  `user_wallet_id` int(11) NOT NULL AUTO_INCREMENT,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `signature` varchar(256) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `wallet_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_wallet_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
 */
export interface IUserWallet {
  user_wallet_id: number;
  status: number;
  signature: string | null;
  created_at: Date;
  updated_at: Date;
  wallet_id: number;
  user_id: number | null;
}