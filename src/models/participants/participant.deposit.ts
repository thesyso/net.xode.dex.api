export interface IParticipantDeposit {
  participant_deposit_uid: number;
  market_code: string | null;
  status: number | null;
  fee: string | null;
  fee_rate: number | null;
  is_open: boolean;
  is_use: boolean;
  created_at: Date;
  updated_at: Date;
  swap_uid: number;
  participant_uid: number;
}