export interface IParticipant {
  participant_id: number;
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
  pool_id: number;
}

export interface IParticipantDeposit {
  participant_deposit_id: number;
  market_code: string | null;
  status: number | null;
  fee: string | null;
  fee_rate: number | null;
  is_open: boolean;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
  swap_id: number;
  participant_id: number;
}