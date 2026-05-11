// CREATE TABLE `alarm` (
//   `alarm_id` int(11) NOT NULL AUTO_INCREMENT,
//   `status` tinyint(4) NOT NULL DEFAULT 0,
//   `contents` varchar(1024) NOT NULL,
//   `is_notice` bit(1) NOT NULL DEFAULT b'1',
//   `is_use` bit(1) NOT NULL DEFAULT b'1',
//   `sended_at` timestamp NULL DEFAULT NULL,
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   PRIMARY KEY (`alarm_id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='알람';
export interface IAlarm {
  alarm_id: number;
  status: number;
  contents: string;
  is_notice: boolean;
  is_use: boolean;
  sended_at: Date;
  created_at: Date;
  updated_at: Date;
}

// CREATE TABLE `alarm_send` (
//   `send_id` int(11) NOT NULL AUTO_INCREMENT,
//   `is_check` bit(1) NOT NULL DEFAULT b'1',
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `alarm_id` int(11) NOT NULL,
//   `user_wallet_id` int(11) NOT NULL,
//   PRIMARY KEY (`send_id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='알람전송';
export interface IAlarmSend {
  send_id: number;
  is_check: boolean;
  created_at: Date;
  updated_at: Date;
  alarm_id: number;
  user_wallet_id: number;
}