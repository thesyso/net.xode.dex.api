export interface IUser {
  user_uid: number;
  address: string;
  chain: string;
  message: string;
  signature: string;
  wallet_name: string;
  created_at: Date;
  updated_at: Date;
}