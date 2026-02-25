export interface IBoard {
  board_id: number;
  cago: string;
  depth: number;
  writer: string;
  subject: string;
  contents: string | null;
  hits: number;
  favorite: number;
  created_user_id: number;
  updated_user_id: number;
  created_at: Date;
  updated_at: Date;
}