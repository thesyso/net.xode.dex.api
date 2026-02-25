export interface IParticipant {
  participant_uid: number;
  market_code: string | null;
  market_target_code: string | null;
  status: number | null;
  asset: string | null;
  amount: string | null;
  target_amount: string | null;
  start_date: Date | null;
  end_date: Date | null;
  fee: string;
  fee_rate: number;
  withdraw_fee: string;
  withdraw_target_fee: string;
  is_open: boolean;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
  pool_uid: number;
}