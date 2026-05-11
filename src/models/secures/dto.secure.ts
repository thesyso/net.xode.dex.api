// CREATE TABLE `secure` (
//   `secure_id` int(11) NOT NULL AUTO_INCREMENT,
//   `class` varchar(16) NOT NULL DEFAULT 'email',
//   `secure_code` varchar(8) NOT NULL,
//   `is_commit` bit(1) NOT NULL DEFAULT b'0',
//   `is_use` bit(1) NOT NULL DEFAULT b'1',
//   `limited_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `updated_at` timestamp NULL DEFAULT current_timestamp(),
//   `user_id` int(11) NOT NULL,
//   PRIMARY KEY (`secure_id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
export interface ISecure {
  secure_id: number;
  class: string;
  secure_code: string;
  is_commit: boolean;
  is_use: boolean;
  limited_at: Date;
  created_at: Date;
  updated_at: Date | null;
  user_id: number;
}