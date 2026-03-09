export interface ISecure {
  secure_id: number;
  class: string;
  secure_code: string;
  is_use: boolean;
  limited_at: Date;
  created_at: Date;
  updated_at: Date | null;
  user_id: number;
  master_id: number;
}