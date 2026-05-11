// CREATE TABLE `menu` (
//   `menu_code` varchar(16) NOT NULL,
//   `grant` tinyint(4) NOT NULL,
//   `menu_name` varchar(16) NOT NULL,
//   `is_use` bit(1) NOT NULL DEFAULT b'1',
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   PRIMARY KEY (`menu_code`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
export interface IMenu {
  menu_code: string;
  grant: number;
  menu_name: string;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
}